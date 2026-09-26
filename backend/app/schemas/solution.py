from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.solution import SolutionStatus


class SolutionCreateRequest(BaseModel):
    """
    Payload for submitting a completed or field-tested solution.
    """
    problem_id: str = Field(description="Target Problem ObjectId string")
    project_id: str = Field(description="Originating Project ObjectId string")
    title: str = Field(description="Solution Title")
    description: str = Field(description="Detailed overview of the deployed/tested solution")
    solution_type: str = Field(default="Hardware + IoT", description="Type (e.g. Hardware, AI Dashboard, Solar Filter)")
    technology: Optional[List[str]] = Field(default_factory=list, description="Technologies used")
    images: Optional[List[str]] = Field(default_factory=list, description="Photo URLs")
    documents: Optional[List[str]] = Field(default_factory=list, description="PDF / documentation URLs")
    deployment_location: Optional[str] = Field(default=None, description="Site location or Panchayat name")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    deployment_date: Optional[str] = None
    status: Optional[SolutionStatus] = SolutionStatus.PROTOTYPE


class SolutionUpdateRequest(BaseModel):
    """
    Payload for updating solution deployment status.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    solution_type: Optional[str] = None
    technology: Optional[List[str]] = None
    images: Optional[List[str]] = None
    documents: Optional[List[str]] = None
    deployment_location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    deployment_date: Optional[str] = None
    status: Optional[SolutionStatus] = None


class SolutionResponse(BaseModel):
    """
    Public response schema for solution details.
    """
    id: str = Field(description="Solution ID")
    problem_id: str
    problem_title: Optional[str] = None
    project_id: str
    project_name: Optional[str] = None

    title: str
    description: str
    solution_type: str
    technology: List[str] = Field(default_factory=list)

    images: List[str] = Field(default_factory=list)
    documents: List[str] = Field(default_factory=list)

    deployment_location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    deployment_date: Optional[str] = None

    status: SolutionStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SolutionListResponse(BaseModel):
    """
    Paginated list of solutions.
    """
    total: int
    page: int
    limit: int
    pages: int
    solutions: List[SolutionResponse]
