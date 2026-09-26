from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.project import ProjectStatus, MilestoneStatus, Milestone


class MilestoneCreateRequest(BaseModel):
    """
    Payload for adding a milestone to a project.
    """
    title: str = Field(description="Milestone title")
    description: Optional[str] = Field(default=None, description="Detailed deliverable description")
    due_date: Optional[str] = Field(default=None, description="Target completion date (YYYY-MM-DD)")
    status: MilestoneStatus = MilestoneStatus.PENDING


class MilestoneUpdateRequest(BaseModel):
    """
    Payload for updating milestone status.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[MilestoneStatus] = None


class ProjectCreateRequest(BaseModel):
    """
    Payload for initializing a new civic development project.
    """
    name: str = Field(description="Project Name")
    problem_id: str = Field(description="Target Problem ObjectId string")
    collaboration_id: Optional[str] = Field(default=None, description="Linked Collaboration ID")
    university_id: Optional[str] = Field(default=None, description="Lead University User ID")
    industry_id: Optional[str] = Field(default=None, description="Partner Industry User ID")
    team_members: Optional[List[str]] = Field(default_factory=list, description="Names / emails of team members")
    mentor: Optional[str] = Field(default=None, description="Lead Faculty Mentor / Senior Engineer")
    description: str = Field(description="Comprehensive technical description")
    objectives: Optional[List[str]] = Field(default_factory=list, description="Project objectives")
    milestones: Optional[List[MilestoneCreateRequest]] = Field(default_factory=list)
    start_date: Optional[str] = None
    target_date: Optional[str] = None


class ProjectUpdateRequest(BaseModel):
    """
    Payload for updating project details or overall progress.
    """
    name: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[List[str]] = None
    team_members: Optional[List[str]] = None
    mentor: Optional[str] = None
    progress: Optional[float] = Field(default=None, ge=0.0, le=100.0, description="Progress (0-100%)")
    documents: Optional[List[str]] = None
    status: Optional[ProjectStatus] = None
    target_date: Optional[str] = None


class ProjectResponse(BaseModel):
    """
    Public response schema for project details.
    """
    id: str = Field(description="Project ID")
    name: str
    problem_id: str
    problem_title: Optional[str] = None
    collaboration_id: Optional[str] = None

    university_id: Optional[str] = None
    university_name: Optional[str] = None
    industry_id: Optional[str] = None
    industry_name: Optional[str] = None

    team_members: List[str] = Field(default_factory=list)
    mentor: Optional[str] = None
    description: str
    objectives: List[str] = Field(default_factory=list)
    milestones: List[Milestone] = Field(default_factory=list)
    progress: float
    documents: List[str] = Field(default_factory=list)

    status: ProjectStatus
    start_date: Optional[str] = None
    target_date: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """
    Paginated list of projects.
    """
    total: int
    page: int
    limit: int
    pages: int
    projects: List[ProjectResponse]
