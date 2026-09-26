from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class AuditLogDocument(BaseModel):
    """
    MongoDB Document Schema for the 'audit_logs' collection.
    Tracks critical state changes, security actions, and admin approvals.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: Optional[str] = Field(default=None, description="Actor User ID or 'system'")
    user_email: Optional[str] = None
    user_role: Optional[str] = None

    action: str = Field(description="Action verb: LOGIN, REGISTRATION, APPROVE, REJECT, DELETE, DEPLOY, STATUS_CHANGE")
    resource_type: str = Field(description="Target entity type: user, problem, project, solution, collaboration")
    resource_id: Optional[str] = Field(default=None, description="ID of affected entity")

    metadata: Dict[str, Any] = Field(default_factory=dict, description="Contextual details (e.g. before/after values, reason)")
    ip_address: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
