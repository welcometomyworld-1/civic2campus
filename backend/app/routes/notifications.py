import logging
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.schemas.user import UserProfileResponse
from app.schemas.notification import NotificationResponse, NotificationListResponse
from app.services.notification_service import NotificationService

logger = logging.getLogger("civic2campus.routes.notifications")

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get(
    "",
    response_model=NotificationListResponse,
    summary="List User Notifications",
    description="Fetches paginated in-app event notifications for the authenticated user."
)
async def list_notifications(
    unread_only: bool = Query(False, description="Filter only unread notifications"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> NotificationListResponse:
    return await NotificationService.get_user_notifications(
        db=db,
        user_id=str(current_user.id),
        unread_only=unread_only,
        page=page,
        limit=limit
    )


@router.get(
    "/unread",
    response_model=NotificationListResponse,
    summary="Get Unread Notifications Shortcut",
    description="Shortcut endpoint to fetch unread notifications and badge count for navbar badge."
)
async def get_unread_notifications(
    limit: int = Query(10, ge=1, le=50, description="Max unread items"),
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> NotificationListResponse:
    return await NotificationService.get_user_notifications(
        db=db,
        user_id=str(current_user.id),
        unread_only=True,
        page=1,
        limit=limit
    )


@router.put(
    "/{notification_id}/read",
    response_model=NotificationResponse,
    summary="Mark Notification as Read",
    description="Marks a single notification as read by its unique ID."
)
async def mark_notification_read(
    notification_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> NotificationResponse:
    return await NotificationService.mark_as_read(
        db=db,
        notification_id=notification_id,
        user_id=str(current_user.id)
    )


@router.put(
    "/read-all",
    summary="Mark All Notifications as Read",
    description="Marks all unread notifications as read for the authenticated user."
)
async def mark_all_notifications_read(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    count = await NotificationService.mark_all_as_read(
        db=db,
        user_id=str(current_user.id)
    )
    return {
        "success": True,
        "marked_read_count": count,
        "message": f"Successfully marked {count} notifications as read."
    }
