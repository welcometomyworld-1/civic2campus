from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ImpactMetricDocument(BaseModel):
    """
    MongoDB Document Schema for the 'impact_metrics' collection.
    Tracks real-world civic impact indicators post-deployment.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    solution_id: str = Field(description="Target Solution ObjectId string")
    problem_id: Optional[str] = Field(default=None, description="Target Problem ObjectId string")

    people_benefited: int = Field(default=0, description="Estimated number of citizens directly impacted/served")
    area_covered: Optional[str] = Field(default=None, description="Geographical coverage area (e.g. '3 Panchayats, 12 sq km')")
    problem_resolved_percentage: float = Field(default=100.0, description="Percentage of original problem resolved (0-100)")

    cost_saved: Optional[str] = Field(default=None, description="Estimated rupee savings compared to traditional municipal tenders")
    time_saved: Optional[str] = Field(default=None, description="Hours or days saved per month")

    environmental_impact: Optional[str] = Field(default=None, description="CO2 reduction, water saved, waste diverted")
    education_impact: Optional[str] = Field(default=None, description="Students trained, skill competencies gained")
    health_impact: Optional[str] = Field(default=None, description="Reduction in water-borne disease, cleaner air metrics")

    deployment_date: Optional[str] = None
    impact_description: str = Field(description="Detailed narrative of real-world outcome and field verification")

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
