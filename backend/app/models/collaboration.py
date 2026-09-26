from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CollaborationStatus(str, Enum):
    """
    Lifecycle status of a multi-stakeholder collaboration.
    """
    REQUESTED = "REQUESTED"
    APPROVED = "APPROVED"
    ACTIVE = "ACTIVE"
    PROTOTYPE = "PROTOTYPE"
    TESTING = "TESTING"
    COMPLETED = "COMPLETED"
    DEPLOYED = "DEPLOYED"
    CANCELLED = "CANCELLED"


class CollaborationMember(BaseModel):
    """
    Individual participant in a civic R&D collaboration squad.
    """
    user_id: Optional[str] = None
    name: str
    email: Optional[str] = None
    role: str = "Squad Member"  # e.g. Faculty Mentor, Student Lead, CSR Sponsor, Ward Representative
    institution: Optional[str] = None


class CollaborationDocument(BaseModel):
    """
    MongoDB Document Schema for the 'collaborations' collection.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    problem_id: str = Field(description="Target Problem ObjectId string")
    problem_title: Optional[str] = None
    problem_category: Optional[str] = None

    university_id: Optional[str] = Field(default=None, description="University User/Org ObjectId string")
    university_name: Optional[str] = None
    industry_id: Optional[str] = Field(default=None, description="Industry User/Org ObjectId string")
    industry_name: Optional[str] = None
    citizen_id: Optional[str] = Field(default=None, description="Citizen reporter ObjectId string")
    citizen_name: Optional[str] = None
    government_id: Optional[str] = Field(default=None, description="Government official/department ObjectId string")

    title: str = Field(description="Title of the collaboration initiative")
    description: str = Field(description="Scope, methodology, and deliverables of the collaboration")
    mentor: Optional[str] = Field(default=None, description="Faculty mentor or principal advisor")
    members: List[CollaborationMember] = Field(default_factory=list)

    status: CollaborationStatus = CollaborationStatus.REQUESTED
    approval_notes: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
