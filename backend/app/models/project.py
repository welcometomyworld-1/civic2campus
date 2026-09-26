from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ProjectStatus(str, Enum):
    """
    Status of an engineering project build.
    """
    PLANNING = "PLANNING"
    ACTIVE = "ACTIVE"
    PROTOTYPING = "PROTOTYPING"
    TESTING = "TESTING"
    COMPLETED = "COMPLETED"
    DEPLOYED = "DEPLOYED"
    ON_HOLD = "ON_HOLD"
    CANCELLED = "CANCELLED"


class MilestoneStatus(str, Enum):
    """
    Status of a project development milestone.
    """
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    DELAYED = "DELAYED"


class Milestone(BaseModel):
    """
    Specific deliverable milestone within a civic engineering project.
    """
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: MilestoneStatus = MilestoneStatus.PENDING
    completed_at: Optional[datetime] = None


class ProjectDocument(BaseModel):
    """
    MongoDB Document Schema for the 'projects' collection.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    name: str = Field(description="Project Name")
    problem_id: str = Field(description="Target Problem ObjectId string")
    problem_title: Optional[str] = None
    collaboration_id: Optional[str] = Field(default=None, description="Linked Collaboration ObjectId string")

    university_id: Optional[str] = Field(default=None, description="Lead University User ObjectId string")
    university_name: Optional[str] = None
    industry_id: Optional[str] = Field(default=None, description="Partner Industry User ObjectId string")
    industry_name: Optional[str] = None

    team_members: List[str] = Field(default_factory=list, description="Names / emails of student innovators and squad members")
    mentor: Optional[str] = Field(default=None, description="Faculty Mentor or Lead Engineer")

    description: str = Field(description="Comprehensive technical description")
    objectives: List[str] = Field(default_factory=list, description="Core technical & social objectives")
    milestones: List[Milestone] = Field(default_factory=list)
    progress: float = Field(default=0.0, description="Overall completion progress percentage (0-100)")
    documents: List[str] = Field(default_factory=list, description="URLs or filenames of CAD designs, architecture PDFs, reports")

    status: ProjectStatus = ProjectStatus.ACTIVE
    start_date: Optional[str] = None
    target_date: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
