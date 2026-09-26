from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class NotificationType(str, Enum):
    """
    Categorized notification triggers.
    """
    PROBLEM_SUBMITTED = "PROBLEM_SUBMITTED"
    AI_ANALYSIS_COMPLETED = "AI_ANALYSIS_COMPLETED"
    PROBLEM_MATCHED_UNIVERSITY = "PROBLEM_MATCHED_UNIVERSITY"
    PROBLEM_MATCHED_INDUSTRY = "PROBLEM_MATCHED_INDUSTRY"
    COLLABORATION_REQUESTED = "COLLABORATION_REQUESTED"
    COLLABORATION_APPROVED = "COLLABORATION_APPROVED"
    PROJECT_UPDATE = "PROJECT_UPDATE"
    MILESTONE_COMPLETED = "MILESTONE_COMPLETED"
    SOLUTION_DEPLOYED = "SOLUTION_DEPLOYED"
    GOVERNMENT_ALERT = "GOVERNMENT_ALERT"
    ACCOUNT_STATUS = "ACCOUNT_STATUS"
    SYSTEM = "SYSTEM"


class NotificationDocument(BaseModel):
    """
    MongoDB Document Schema for the 'notifications' collection.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str = Field(description="Recipient User ObjectId string or 'all'")
    type: NotificationType = NotificationType.SYSTEM
    title: str = Field(description="Short notification title")
    message: str = Field(description="Detailed notification message")
    related_id: Optional[str] = Field(default=None, description="Linked Problem, Project, or Match ID")
    related_type: Optional[str] = Field(default=None, description="e.g. 'problem', 'project', 'collaboration', 'solution'")
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
