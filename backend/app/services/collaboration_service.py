import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.user import UserRole
from app.models.collaboration import CollaborationStatus, CollaborationMember
from app.schemas.user import UserProfileResponse
from app.schemas.collaboration import (
    CollaborationCreateRequest,
    CollaborationUpdateRequest,
    CollaborationApproveRequest,
    CollaborationResponse,
    CollaborationListResponse,
)

logger = logging.getLogger("civic2campus.collaboration_service")


class CollaborationService:
    """
    Service managing multi-stakeholder collaborations connecting Universities,
    Industries, Citizens, and Government officials.
    """

    @staticmethod
    def _doc_to_response(doc: Dict[str, Any]) -> CollaborationResponse:
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]

        members_raw = doc_copy.get("members", [])
        parsed_members = []
        for m in members_raw:
            if isinstance(m, dict):
                parsed_members.append(CollaborationMember(**m))
            elif isinstance(m, CollaborationMember):
                parsed_members.append(m)

        return CollaborationResponse(
            id=doc_copy["id"],
            problem_id=str(doc_copy["problem_id"]),
            problem_title=doc_copy.get("problem_title"),
            problem_category=doc_copy.get("problem_category"),
            university_id=doc_copy.get("university_id"),
            university_name=doc_copy.get("university_name"),
            industry_id=doc_copy.get("industry_id"),
            industry_name=doc_copy.get("industry_name"),
            citizen_id=doc_copy.get("citizen_id"),
            citizen_name=doc_copy.get("citizen_name"),
            government_id=doc_copy.get("government_id"),
            title=doc_copy["title"],
            description=doc_copy["description"],
            mentor=doc_copy.get("mentor"),
            members=parsed_members,
            status=CollaborationStatus(doc_copy.get("status", CollaborationStatus.REQUESTED.value)),
            approval_notes=doc_copy.get("approval_notes"),
            created_at=doc_copy.get("created_at", datetime.utcnow()),
            updated_at=doc_copy.get("updated_at", datetime.utcnow()),
        )

    @classmethod
    async def create_collaboration(
        cls,
        db: AsyncIOMotorDatabase,
        current_user: UserProfileResponse,
        payload: CollaborationCreateRequest,
    ) -> CollaborationResponse:
        """
        Creates a new collaboration proposal for a problem.
        """
        problems_col = db["problems"]
        collab_col = db["collaborations"]

        try:
            prob_oid = ObjectId(payload.problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": prob_oid})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        now = datetime.utcnow()
        doc = payload.model_dump()
        doc["problem_title"] = problem.get("title")
        doc["problem_category"] = problem.get("category")
        doc["citizen_id"] = str(problem.get("reported_by", {}).get("user_id", ""))
        doc["citizen_name"] = problem.get("reported_by", {}).get("name")

        # Assign initiator roles
        if current_user.role == UserRole.UNIVERSITY:
            doc["university_id"] = current_user.id
            doc["university_name"] = current_user.organization_name or current_user.name
        elif current_user.role == UserRole.INDUSTRY:
            doc["industry_id"] = current_user.id
            doc["industry_name"] = current_user.company_name or current_user.name

        # Ensure creator is in members list
        members = doc.get("members", [])
        creator_member = {
            "user_id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": "Squad Lead" if current_user.role == UserRole.UNIVERSITY else "CSR Lead",
            "institution": current_user.organization_name or current_user.company_name or "Civic Partner"
        }
        if not any(m.get("user_id") == current_user.id for m in members if isinstance(m, dict)):
            members.append(creator_member)
        doc["members"] = members

        doc["status"] = CollaborationStatus.REQUESTED.value
        doc["created_at"] = now
        doc["updated_at"] = now

        result = await collab_col.insert_one(doc)
        doc["_id"] = result.inserted_id

        # Update problem status to COLLABORATION
        await problems_col.update_one(
            {"_id": prob_oid},
            {"$set": {"status": "COLLABORATION", "updated_at": now}}
        )

        logger.info(f"Collaboration proposal created '{payload.title}' (ID: {result.inserted_id})")
        return cls._doc_to_response(doc)

    @classmethod
    async def list_collaborations(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        problem_id: Optional[str] = None,
        status_filter: Optional[CollaborationStatus] = None,
        university_id: Optional[str] = None,
        industry_id: Optional[str] = None,
    ) -> CollaborationListResponse:
        """
        Retrieves paginated collaborations with optional filters.
        """
        collab_col = db["collaborations"]
        query: Dict[str, Any] = {}

        if problem_id:
            query["problem_id"] = problem_id
        if status_filter:
            query["status"] = status_filter.value
        if university_id:
            query["university_id"] = university_id
        if industry_id:
            query["industry_id"] = industry_id

        total = await collab_col.count_documents(query)
        skip = (page - 1) * limit

        cursor = collab_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
        items = []
        async for doc in cursor:
            items.append(cls._doc_to_response(doc))

        pages = max(1, (total + limit - 1) // limit)
        return CollaborationListResponse(
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            collaborations=items
        )

    @classmethod
    async def get_collaboration_by_id(
        cls,
        db: AsyncIOMotorDatabase,
        collaboration_id: str
    ) -> CollaborationResponse:
        """
        Fetches single collaboration details.
        """
        collab_col = db["collaborations"]
        try:
            oid = ObjectId(collaboration_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid collaboration ID format.")

        doc = await collab_col.find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collaboration not found.")

        return cls._doc_to_response(doc)

    @classmethod
    async def update_collaboration(
        cls,
        db: AsyncIOMotorDatabase,
        collaboration_id: str,
        current_user: UserProfileResponse,
        payload: CollaborationUpdateRequest
    ) -> CollaborationResponse:
        """
        Updates collaboration details, status, or squad members.
        """
        collab_col = db["collaborations"]
        try:
            oid = ObjectId(collaboration_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid collaboration ID format.")

        existing = await collab_col.find_one({"_id": oid})
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collaboration not found.")

        update_dict = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
        if "status" in update_dict and isinstance(update_dict["status"], CollaborationStatus):
            update_dict["status"] = update_dict["status"].value
        if "members" in update_dict:
            update_dict["members"] = [m if isinstance(m, dict) else m.model_dump() for m in update_dict["members"]]

        update_dict["updated_at"] = datetime.utcnow()

        updated = await collab_col.find_one_and_update(
            {"_id": oid},
            {"$set": update_dict},
            return_document=True
        )
        return cls._doc_to_response(updated)

    @classmethod
    async def approve_collaboration(
        cls,
        db: AsyncIOMotorDatabase,
        collaboration_id: str,
        current_user: UserProfileResponse,
        payload: CollaborationApproveRequest
    ) -> CollaborationResponse:
        """
        Approves a collaboration request and activates project prototyping stage.
        """
        collab_col = db["collaborations"]
        problems_col = db["problems"]
        now = datetime.utcnow()

        try:
            oid = ObjectId(collaboration_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid collaboration ID format.")

        existing = await collab_col.find_one({"_id": oid})
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collaboration not found.")

        updated = await collab_col.find_one_and_update(
            {"_id": oid},
            {
                "$set": {
                    "status": CollaborationStatus.APPROVED.value,
                    "approval_notes": payload.notes,
                    "updated_at": now
                }
            },
            return_document=True
        )

        # Update problem status to IN_PROGRESS
        try:
            prob_oid = ObjectId(existing["problem_id"])
            await problems_col.update_one(
                {"_id": prob_oid},
                {"$set": {"status": "IN_PROGRESS", "updated_at": now}}
            )
        except Exception:
            pass

        logger.info(f"Collaboration {collaboration_id} approved by {current_user.email}")
        return cls._doc_to_response(updated)
