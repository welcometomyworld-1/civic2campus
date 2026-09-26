from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.collaboration import CollaborationStatus, CollaborationMember


class CollaborationCreateRequest(BaseModel):
    """
    Payload for proposing a new collaboration between University, Industry, and Citizens.
    """
    problem_id: str = Field(description="Target Problem ObjectId string")
    title: str = Field(description="Title of collaboration effort")
    description: str = Field(description="Scope, methodology, and deliverables")
    university_id: Optional[str] = Field(default=None, description="University User ID")
    industry_id: Optional[str] = Field(default=None, description="Industry Partner User ID")
    mentor: Optional[str] = Field(default=None, description="Lead Faculty Mentor name/title")
    members: Optional[List[CollaborationMember]] = Field(default_factory=list)


class CollaborationUpdateRequest(BaseModel):
    """
    Payload for updating collaboration details.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    mentor: Optional[str] = None
    members: Optional[List[CollaborationMember]] = None
    status: Optional[CollaborationStatus] = None
    approval_notes: Optional[str] = None


class CollaborationApproveRequest(BaseModel):
    """
    Payload for approving a collaboration request.
    """
    notes: Optional[str] = Field(default="Collaboration approved for active prototyping and sponsorship.", description="Approval notes")


class CollaborationResponse(BaseModel):
    """
    Public response schema for collaboration details.
    """
    id: str = Field(description="Collaboration ID")
    problem_id: str
    problem_title: Optional[str] = None
    problem_category: Optional[str] = None

    university_id: Optional[str] = None
    university_name: Optional[str] = None
    industry_id: Optional[str] = None
    industry_name: Optional[str] = None
    citizen_id: Optional[str] = None
    citizen_name: Optional[str] = None
    government_id: Optional[str] = None

    title: str
    description: str
    mentor: Optional[str] = None
    members: List[CollaborationMember] = Field(default_factory=list)

    status: CollaborationStatus
    approval_notes: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CollaborationListResponse(BaseModel):
    """
    Paginated list of collaborations.
    """
    total: int
    page: int
    limit: int
    pages: int
    collaborations: List[CollaborationResponse]
