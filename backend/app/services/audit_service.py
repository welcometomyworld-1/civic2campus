import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.schemas.user import UserProfileResponse
from app.schemas.admin import AuditLogResponse, AuditLogListResponse

logger = logging.getLogger("civic2campus.audit_service")


class AuditService:
    """
    Service recording and querying security, moderation, and system audit trails.
    """

    @classmethod
    async def log_action(
        cls,
        db: AsyncIOMotorDatabase,
        action: str,
        resource_type: str,
        user: Optional[UserProfileResponse] = None,
        user_id: Optional[str] = None,
        user_email: Optional[str] = None,
        user_role: Optional[str] = None,
        resource_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
    ) -> None:
        """
        Asynchronously writes an audit event to the 'audit_logs' collection.
        Non-blocking and resilient to failure.
        """
        try:
            audit_col = db["audit_logs"]
            now = datetime.utcnow()

            uid = user.id if user else (user_id or "anonymous")
            email = user.email if user else (user_email or None)
            role = (user.role.value if hasattr(user.role, "value") else str(user.role)) if user else (user_role or None)

            log_doc = {
                "user_id": uid,
                "user_email": email,
                "user_role": role,
                "action": action.upper(),
                "resource_type": resource_type.lower(),
                "resource_id": resource_id,
                "metadata": metadata or {},
                "ip_address": ip_address,
                "created_at": now
            }
            await audit_col.insert_one(log_doc)
        except Exception as exc:
            logger.warning(f"Failed to record audit log: {exc}")

    @classmethod
    async def list_logs(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 30,
        action: Optional[str] = None,
        resource_type: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> AuditLogListResponse:
        """
        Fetches paginated audit logs for system administrators.
        """
        audit_col = db["audit_logs"]
        query: Dict[str, Any] = {}

        if action:
            query["action"] = action.upper()
        if resource_type:
            query["resource_type"] = resource_type.lower()
        if user_id:
            query["user_id"] = user_id

        total = await audit_col.count_documents(query)
        skip = (page - 1) * limit

        cursor = audit_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
        items = []
        async for doc in cursor:
            items.append(
                AuditLogResponse(
                    id=str(doc["_id"]),
                    user_id=doc.get("user_id"),
                    user_email=doc.get("user_email"),
                    user_role=doc.get("user_role"),
                    action=doc.get("action", ""),
                    resource_type=doc.get("resource_type", ""),
                    resource_id=doc.get("resource_id"),
                    metadata=doc.get("metadata", {}),
                    ip_address=doc.get("ip_address"),
                    created_at=doc.get("created_at", datetime.utcnow())
                )
            )

        return AuditLogListResponse(
            total=total,
            page=page,
            limit=limit,
            logs=items
        )
