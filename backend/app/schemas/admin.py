from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.user import UserRole, AccountStatus
from app.schemas.user import UserProfileResponse


class AdminUserStatusUpdateRequest(BaseModel):
    """
    Payload for administrator toggling account activation/suspension.
    """
    status: AccountStatus
    reason: Optional[str] = None


class AdminOrganizationReviewRequest(BaseModel):
    """
    Payload for approving or rejecting university / industry verification.
    """
    action: str = Field(description="'APPROVE' or 'REJECT'")
    verification_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


class AuditLogResponse(BaseModel):
    """
    Audit log trail item.
    """
    id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    user_role: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AuditLogListResponse(BaseModel):
    """
    Paginated audit logs.
    """
    total: int
    page: int
    limit: int
    logs: List[AuditLogResponse]
