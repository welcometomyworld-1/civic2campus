import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.notification import NotificationType
from app.schemas.notification import NotificationResponse, NotificationListResponse

logger = logging.getLogger("civic2campus.notification_service")


class NotificationService:
    """
    Service managing real-time notifications for citizen reports, AI completions,
    match proposals, squad updates, and field deployment milestones.
    """

    @classmethod
    async def create_notification(
        cls,
        db: AsyncIOMotorDatabase,
        user_id: str,
        title: str,
        message: str,
        type: NotificationType = NotificationType.SYSTEM,
        notification_type: Optional[NotificationType] = None,
        related_id: Optional[str] = None,
        related_type: Optional[str] = None,
    ) -> NotificationResponse:
        """
        Dispatches an in-app notification to a specific user or 'all'.
        """
        notif_col = db["notifications"]
        now = datetime.utcnow()

        effective_type = notification_type or type
        type_val = effective_type.value if hasattr(effective_type, "value") else str(effective_type)

        doc = {
            "user_id": user_id,
            "type": type_val,
            "title": title,
            "message": message,
            "related_id": related_id,
            "related_type": related_type,
            "is_read": False,
            "created_at": now
        }

        result = await notif_col.insert_one(doc)
        doc["_id"] = result.inserted_id

        return NotificationResponse(
            id=str(doc["_id"]),
            user_id=doc["user_id"],
            type=NotificationType(doc["type"]),
            title=doc["title"],
            message=doc["message"],
            related_id=doc.get("related_id"),
            related_type=doc.get("related_type"),
            is_read=doc["is_read"],
            created_at=doc["created_at"]
        )

    @classmethod
    async def get_user_notifications(
        cls,
        db: AsyncIOMotorDatabase,
        user_id: str,
        unread_only: bool = False,
        page: int = 1,
        limit: int = 20
    ) -> NotificationListResponse:
        """
        Retrieves user notifications with unread counts.
        """
        notif_col = db["notifications"]
        query: Dict[str, Any] = {"$or": [{"user_id": user_id}, {"user_id": "all"}]}

        if unread_only:
            query["is_read"] = False

        total = await notif_col.count_documents(query)
        unread_count = await notif_col.count_documents({"$or": [{"user_id": user_id}, {"user_id": "all"}], "is_read": False})

        skip = (page - 1) * limit
        cursor = notif_col.find(query).sort("created_at", -1).skip(skip).limit(limit)

        items = []
        async for doc in cursor:
            items.append(
                NotificationResponse(
                    id=str(doc["_id"]),
                    user_id=doc["user_id"],
                    type=NotificationType(doc.get("type", NotificationType.SYSTEM.value)),
                    title=doc["title"],
                    message=doc["message"],
                    related_id=doc.get("related_id"),
                    related_type=doc.get("related_type"),
                    is_read=doc.get("is_read", False),
                    created_at=doc.get("created_at", datetime.utcnow())
                )
            )

        return NotificationListResponse(
            total=total,
            unread_count=unread_count,
            notifications=items
        )

    @classmethod
    async def mark_as_read(
        cls,
        db: AsyncIOMotorDatabase,
        notification_id: str,
        user_id: str
    ) -> NotificationResponse:
        """
        Marks a specific notification as read.
        """
        notif_col = db["notifications"]
        try:
            oid = ObjectId(notification_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid notification ID format.")

        doc = await notif_col.find_one_and_update(
            {"_id": oid, "$or": [{"user_id": user_id}, {"user_id": "all"}]},
            {"$set": {"is_read": True}},
            return_document=True
        )
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")

        return NotificationResponse(
            id=str(doc["_id"]),
            user_id=doc["user_id"],
            type=NotificationType(doc.get("type", NotificationType.SYSTEM.value)),
            title=doc["title"],
            message=doc["message"],
            related_id=doc.get("related_id"),
            related_type=doc.get("related_type"),
            is_read=True,
            created_at=doc.get("created_at", datetime.utcnow())
        )

    @classmethod
    async def mark_all_as_read(
        cls,
        db: AsyncIOMotorDatabase,
        user_id: str
    ) -> Dict[str, Any]:
        """
        Marks all notifications for a user as read.
        """
        notif_col = db["notifications"]
        res = await notif_col.update_many(
            {"$or": [{"user_id": user_id}, {"user_id": "all"}], "is_read": False},
            {"$set": {"is_read": True}}
        )
        return {"success": True, "updated_count": res.modified_count, "message": "All notifications marked as read."}
