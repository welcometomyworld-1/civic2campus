from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ImpactCreateRequest(BaseModel):
    """
    Payload for submitting or updating post-deployment impact metrics.
    """
    people_benefited: int = Field(default=0, ge=0, description="Citizens benefited")
    area_covered: Optional[str] = Field(default=None, description="Geographical coverage (e.g. '3 Panchayats')")
    problem_resolved_percentage: float = Field(default=100.0, ge=0.0, le=100.0, description="Resolution percentage")
    cost_saved: Optional[str] = Field(default=None, description="Estimated economic savings")
    time_saved: Optional[str] = Field(default=None, description="Estimated time saved")
    environmental_impact: Optional[str] = Field(default=None, description="Environmental improvements")
    education_impact: Optional[str] = Field(default=None, description="Education/skills outcome")
    health_impact: Optional[str] = Field(default=None, description="Health improvements")
    deployment_date: Optional[str] = None
    impact_description: str = Field(description="Detailed narrative of verified field impact")


class ImpactResponse(BaseModel):
    """
    Response schema for verified field impact data.
    """
    id: str = Field(description="Impact Metric Record ID")
    solution_id: str
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None

    people_benefited: int
    area_covered: Optional[str] = None
    problem_resolved_percentage: float
    cost_saved: Optional[str] = None
    time_saved: Optional[str] = None
    environmental_impact: Optional[str] = None
    education_impact: Optional[str] = None
    health_impact: Optional[str] = None
    deployment_date: Optional[str] = None
    impact_description: str

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
