import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.user import UserRole, AccountStatus, UserDocument
from app.models.notification import NotificationType
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService

logger = logging.getLogger("civic2campus.admin_service")


class AdminService:
    """
    Comprehensive administrative control panel service handling user management,
    organization verifications, system moderation, and governance metrics.
    """

    @classmethod
    async def get_system_stats(cls, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        """
        Gathers aggregate metrics directly from MongoDB collections for the admin control room.
        """
        users_col = db["users"]
        problems_col = db["problems"]
        collab_col = db["collaborations"]
        projects_col = db["projects"]
        solutions_col = db["solutions"]
        univ_col = db["universities"]
        ind_col = db["industries"]
        audit_col = db["audit_logs"]

        total_users = await users_col.count_documents({})
        active_users = await users_col.count_documents({"status": AccountStatus.ACTIVE.value})
        pending_users = await users_col.count_documents({"status": AccountStatus.PENDING.value})

        total_problems = await problems_col.count_documents({})
        ai_analyzed_problems = await problems_col.count_documents({"ai_analysis_status": "COMPLETED"})
        
        total_collabs = await collab_col.count_documents({})
        active_collabs = await collab_col.count_documents({"status": {"$in": ["APPROVED", "ACTIVE", "PROTOTYPE", "TESTING"]}})
        
        total_projects = await projects_col.count_documents({})
        completed_projects = await projects_col.count_documents({"status": "COMPLETED"})

        total_solutions = await solutions_col.count_documents({})
        deployed_solutions = await solutions_col.count_documents({"status": "DEPLOYED"})

        pending_univs = await univ_col.count_documents({"verification_status": "Pending"})
        pending_inds = await ind_col.count_documents({"verification_status": "Pending"})

        # Role distribution breakdown
        role_counts = {}
        for role in UserRole:
            count = await users_col.count_documents({"role": role.value})
            role_counts[role.value.lower()] = count

        return {
            "users": {
                "total": total_users,
                "active": active_users,
                "pending": pending_users,
                "by_role": role_counts
            },
            "problems": {
                "total": total_problems,
                "ai_analyzed": ai_analyzed_problems,
            },
            "collaborations": {
                "total": total_collabs,
                "active": active_collabs,
            },
            "projects": {
                "total": total_projects,
                "completed": completed_projects
            },
            "solutions": {
                "total": total_solutions,
                "deployed": deployed_solutions
            },
            "pending_verifications": {
                "universities": pending_univs,
                "industries": pending_inds,
                "total_pending": pending_univs + pending_inds
            }
        }

    @classmethod
    async def list_users(
        cls,
        db: AsyncIOMotorDatabase,
        role: Optional[str] = None,
        status_filter: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        List platform users with filtering, search and pagination.
        """
        users_col = db["users"]
        query: Dict[str, Any] = {}

        if role:
            query["role"] = role.upper()
        if status_filter:
            query["status"] = status_filter.upper()
        if search:
            query["$or"] = [
                {"email": {"$regex": search, "$options": "i"}},
                {"full_name": {"$regex": search, "$options": "i"}},
                {"organization_name": {"$regex": search, "$options": "i"}},
            ]

        total = await users_col.count_documents(query)
        skip = (page - 1) * limit
        cursor = users_col.find(query).sort("created_at", -1).skip(skip).limit(limit)

        users = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            doc.pop("hashed_password", None)
            users.append(doc)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1,
            "users": users
        }

    @classmethod
    async def update_user_status(
        cls,
        db: AsyncIOMotorDatabase,
        user_id: str,
        new_status: AccountStatus,
        reason: Optional[str],
        admin_user: UserDocument,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Updates an account status (ACTIVE, SUSPENDED, PENDING_APPROVAL).
        """
        users_col = db["users"]
        
        try:
            oid = ObjectId(user_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid user ID format: '{user_id}'"
            )

        target_user = await users_col.find_one({"_id": oid})
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        old_status = target_user.get("status")
        now = datetime.now(timezone.utc)

        update_fields: Dict[str, Any] = {
            "status": new_status.value,
            "updated_at": now
        }
        if new_status == AccountStatus.ACTIVE:
            update_fields["is_verified"] = True

        await users_col.update_one({"_id": oid}, {"$set": update_fields})

        # Log audit trail
        await AuditService.log_action(
            db=db,
            user_id=str(admin_user.id),
            user_email=admin_user.email,
            user_role=admin_user.role.value,
            action="USER_STATUS_CHANGE",
            resource_type="USER",
            resource_id=user_id,
            metadata={
                "target_email": target_user.get("email"),
                "old_status": old_status,
                "new_status": new_status.value,
                "reason": reason
            },
            ip_address=ip_address
        )

        # Notify user of status change
        await NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.GOVERNMENT_HIGH_PRIORITY if new_status == AccountStatus.SUSPENDED else NotificationType.COLLABORATION_APPROVED,
            title=f"Account Status Updated: {new_status.value}",
            message=f"Your account status is now {new_status.value}. {reason or ''}".strip(),
            related_id=user_id,
            related_type="USER"
        )

        return {
            "id": user_id,
            "email": target_user.get("email"),
            "old_status": old_status,
            "new_status": new_status.value,
            "updated_at": now
        }

    @classmethod
    async def review_organization(
        cls,
        db: AsyncIOMotorDatabase,
        org_id: str,
        action: str,  # 'APPROVE' or 'REJECT'
        verification_notes: Optional[str],
        rejection_reason: Optional[str],
        admin_user: UserDocument,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Approve or reject a University / Industry organization.
        """
        users_col = db["users"]
        univ_col = db["universities"]
        ind_col = db["industries"]

        action_upper = action.upper()
        if action_upper not in ["APPROVE", "REJECT"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Action must be 'APPROVE' or 'REJECT'"
            )

        # Check in users collection first or univ/industry
        target_user = None
        try:
            target_user = await users_col.find_one({"_id": ObjectId(org_id)})
        except Exception:
            pass

        now = datetime.now(timezone.utc)
        is_approved = (action_upper == "APPROVE")
        new_status = AccountStatus.ACTIVE.value if is_approved else AccountStatus.SUSPENDED.value
        verif_status_str = "Approved" if is_approved else "Rejected"

        if target_user:
            t_id = target_user.get("_id") or target_user.get("id") or org_id
            try:
                t_oid = ObjectId(t_id) if isinstance(t_id, str) else t_id
            except Exception:
                t_oid = t_id

            await users_col.update_one(
                {"_id": t_oid},
                {
                    "$set": {
                        "status": new_status,
                        "is_verified": is_approved,
                        "verification_notes": verification_notes or rejection_reason,
                        "updated_at": now
                    }
                }
            )

        # Also update universities/industries if registered by email or ID
        if target_user:
            email = target_user.get("email")
            await univ_col.update_many(
                {"official_email": email},
                {"$set": {"verification_status": verif_status_str, "updated_at": now}}
            )
            await ind_col.update_many(
                {"official_email": email},
                {"$set": {"verification_status": verif_status_str, "updated_at": now}}
            )

        # Log audit trail
        await AuditService.log_action(
            db=db,
            user_id=str(admin_user.id),
            user_email=admin_user.email,
            user_role=admin_user.role.value,
            action="ORGANIZATION_VERIFICATION_APPROVED" if is_approved else "ORGANIZATION_VERIFICATION_REJECTED",
            resource_type="ORGANIZATION",
            resource_id=org_id,
            metadata={
                "action": action_upper,
                "notes": verification_notes,
                "reason": rejection_reason,
                "org_email": target_user.get("email") if target_user else None
            },
            ip_address=ip_address
        )

        # Send notification
        if target_user:
            await NotificationService.create_notification(
                db=db,
                user_id=str(t_id),
                notification_type=NotificationType.COLLABORATION_APPROVED if is_approved else NotificationType.GOVERNMENT_HIGH_PRIORITY,
                title=f"Organization {verif_status_str}",
                message=f"Your institutional organization verification has been {verif_status_str.lower()}. {verification_notes or rejection_reason or ''}".strip(),
                related_id=org_id,
                related_type="ORGANIZATION"
            )

        return {
            "id": org_id,
            "status": "APPROVED" if is_approved else "REJECTED",
            "account_status": new_status,
            "message": f"Organization successfully {verif_status_str.lower()}."
        }

    @classmethod
    async def list_admin_problems(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        status_filter: Optional[str] = None,
        category: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Global administrative problem monitor with full unredacted attributes.
        """
        problems_col = db["problems"]
        query: Dict[str, Any] = {}
        if status_filter:
            query["status"] = status_filter.upper()
        if category:
            query["category"] = category

        total = await problems_col.count_documents(query)
        skip = (page - 1) * limit
        cursor = problems_col.find(query).sort("created_at", -1).skip(skip).limit(limit)

        problems = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            problems.append(doc)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1,
            "problems": problems
        }

    @classmethod
    async def list_admin_projects(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        status_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Administrative view of all R&D projects across universities & industries.
        """
        projects_col = db["projects"]
        query: Dict[str, Any] = {}
        if status_filter:
            query["status"] = status_filter.upper()

        total = await projects_col.count_documents(query)
        skip = (page - 1) * limit
        cursor = projects_col.find(query).sort("created_at", -1).skip(skip).limit(limit)

        projects = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            projects.append(doc)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1,
            "projects": projects
        }

    @classmethod
    async def list_admin_solutions(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        status_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Administrative view of all deployed solutions and engineering prototypes.
        """
        solutions_col = db["solutions"]
        query: Dict[str, Any] = {}
        if status_filter:
            query["status"] = status_filter.upper()

        total = await solutions_col.count_documents(query)
        skip = (page - 1) * limit
        cursor = solutions_col.find(query).sort("created_at", -1).skip(skip).limit(limit)

        solutions = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            solutions.append(doc)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1,
            "solutions": solutions
        }
