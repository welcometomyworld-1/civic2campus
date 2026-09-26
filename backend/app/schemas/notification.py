from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.notification import NotificationType


class NotificationCreateRequest(BaseModel):
    """
    Internal/Admin payload to create a notification.
    """
    user_id: str
    type: NotificationType = NotificationType.SYSTEM
    title: str
    message: str
    related_id: Optional[str] = None
    related_type: Optional[str] = None


class NotificationResponse(BaseModel):
    """
    User notification item response.
    """
    id: str
    user_id: str
    type: NotificationType
    title: str
    message: str
    related_id: Optional[str] = None
    related_type: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    """
    Paginated list of notifications with unread counter.
    """
    total: int
    unread_count: int
    notifications: List[NotificationResponse]
