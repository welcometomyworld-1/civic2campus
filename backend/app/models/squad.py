from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class SquadStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    DISBANDED = "DISBANDED"


class SquadPhase(str, Enum):
    PROBLEM_ANALYSIS = "PROBLEM_ANALYSIS"
    RESEARCH = "RESEARCH"
    DESIGN = "DESIGN"
    PROTOTYPE = "PROTOTYPE"
    TESTING = "TESTING"
    FIELD_TRIAL = "FIELD_TRIAL"
    DEPLOYMENT = "DEPLOYMENT"
    COMPLETED = "COMPLETED"


class StudentRole(str, Enum):
    TEAM_LEADER = "TEAM_LEADER"
    DEVELOPER = "DEVELOPER"
    RESEARCHER = "RESEARCHER"
    DESIGNER = "DESIGNER"
    DATA_ANALYST = "DATA_ANALYST"
    DOMAIN_SPECIALIST = "DOMAIN_SPECIALIST"
    FIELD_COORDINATOR = "FIELD_COORDINATOR"
    OTHER = "OTHER"


class SquadMilestoneStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    OVERDUE = "OVERDUE"


class SquadTaskPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class SquadTaskStatus(str, Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    BLOCKED = "BLOCKED"
    COMPLETED = "COMPLETED"


class IndustrySupportType(str, Enum):
    TECHNOLOGY = "TECHNOLOGY"
    MENTORSHIP = "MENTORSHIP"
    FUNDING = "FUNDING"
    CSR = "CSR"
    INFRASTRUCTURE = "INFRASTRUCTURE"
    R_AND_D = "R&D"
    TRAINING = "TRAINING"


class FieldTestStatus(str, Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class SquadMember(BaseModel):
    student_id: str = Field(description="Unique Student Roll/Registration ID")
    name: str
    email: Optional[str] = None
    department: str = Field(default="Engineering")
    year: int = Field(default=3)
    skills: List[str] = Field(default_factory=list)
    role: StudentRole = StudentRole.DEVELOPER
    current_task: Optional[str] = None
    task_status: Optional[str] = None
    avatar_url: Optional[str] = None


class SquadMilestone(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    responsible_member: Optional[str] = None
    status: SquadMilestoneStatus = SquadMilestoneStatus.PENDING
    progress: int = Field(default=0, ge=0, le=100)
    completed_at: Optional[str] = None


class SquadTask(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    assigned_member: Optional[str] = None
    priority: SquadTaskPriority = SquadTaskPriority.MEDIUM
    due_date: Optional[str] = None
    status: SquadTaskStatus = SquadTaskStatus.TODO


class SquadDocumentItem(BaseModel):
    id: Optional[str] = None
    name: str
    type: str = Field(default="Report", description="e.g. Research papers, Project reports, Prototype documentation, Presentation, Design files, Testing reports, Field survey, Final report")
    uploaded_by: Optional[str] = None
    upload_date: Optional[str] = None
    version: str = Field(default="1.0")
    url: Optional[str] = None


class FieldTestRecord(BaseModel):
    id: Optional[str] = None
    location: str
    date: str
    objective: str
    participants: List[str] = Field(default_factory=list)
    observed_results: Optional[str] = None
    issues_found: Optional[str] = None
    feedback: Optional[str] = None
    photos_videos: List[str] = Field(default_factory=list)
    status: FieldTestStatus = FieldTestStatus.PLANNED


class SquadImpactRecord(BaseModel):
    people_benefited: int = Field(default=0)
    area_covered: Optional[str] = None
    problem_resolution_percentage: int = Field(default=0, ge=0, le=100)
    cost_saved: Optional[str] = None
    time_saved: Optional[str] = None
    environmental_impact: Optional[str] = None
    community_feedback: Optional[str] = None
    deployment_date: Optional[str] = None


class SquadActivityItem(BaseModel):
    id: Optional[str] = None
    date: str
    user: str
    action: str
    description: str


class StudentSquadDocument(BaseModel):
    """
    MongoDB Document Schema for the 'student_squads' collection.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    squad_id: str = Field(description="Auto-generated unique Squad Code, e.g. SE-001")
    name: str = Field(description="Squad Name")
    description: Optional[str] = None

    project_name: Optional[str] = None
    project_id: Optional[str] = None
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    problem_category: Optional[str] = None
    problem_location: Optional[str] = None
    problem_priority: Optional[str] = None
    ai_match_score: Optional[int] = None
    ai_analysis_id: Optional[str] = None

    team_leader_id: Optional[str] = None
    team_leader_name: Optional[str] = None

    members: List[SquadMember] = Field(default_factory=list)
    max_team_size: int = Field(default=6)

    faculty_mentor_id: Optional[str] = None
    faculty_mentor_name: Optional[str] = None
    faculty_mentor_email: Optional[str] = None
    faculty_mentor_department: Optional[str] = None

    industry_partner_id: Optional[str] = None
    industry_partner_name: Optional[str] = None
    industry_partner_mentor: Optional[str] = None
    industry_partner_designation: Optional[str] = None
    industry_partner_email: Optional[str] = None
    industry_support_type: Optional[str] = None
    funding_received: Optional[str] = None

    government_partner: Optional[str] = None
    external_mentor: Optional[str] = None

    department: Optional[str] = Field(default="Engineering")
    course: Optional[str] = Field(default="B.Tech")
    year: Optional[int] = Field(default=4)

    research_area: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    objectives: List[str] = Field(default_factory=list)
    expected_outcome: Optional[str] = None

    current_phase: SquadPhase = SquadPhase.PROBLEM_ANALYSIS
    progress: int = Field(default=0, ge=0, le=100)
    status: SquadStatus = SquadStatus.ACTIVE

    start_date: Optional[str] = None
    target_date: Optional[str] = None

    milestones: List[SquadMilestone] = Field(default_factory=list)
    tasks: List[SquadTask] = Field(default_factory=list)
    documents: List[SquadDocumentItem] = Field(default_factory=list)
    field_testing: List[FieldTestRecord] = Field(default_factory=list)
    impact: Optional[SquadImpactRecord] = None
    activity_timeline: List[SquadActivityItem] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
