from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class SolutionStatus(str, Enum):
    """
    Validation and field deployment status of a developed solution.
    """
    PROTOTYPE = "PROTOTYPE"
    TESTING = "TESTING"
    APPROVED = "APPROVED"
    DEPLOYED = "DEPLOYED"
    FAILED = "FAILED"
    ARCHIVED = "ARCHIVED"


class SolutionDocument(BaseModel):
    """
    MongoDB Document Schema for the 'solutions' collection.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    problem_id: str = Field(description="Target Problem ObjectId string")
    problem_title: Optional[str] = None
    project_id: str = Field(description="Originating Project ObjectId string")
    project_name: Optional[str] = None

    title: str = Field(description="Solution Title")
    description: str = Field(description="Comprehensive technical & operational overview of the built solution")
    solution_type: str = Field(default="Hardware + IoT", description="e.g. Hardware, Software/AI Dashboard, Bio-Filter, Micro-Grid")
    technology: List[str] = Field(default_factory=list, description="Technologies utilized in build (e.g. ESP32, LoRaWAN, PyTorch)")

    images: List[str] = Field(default_factory=list, description="URLs to prototype photos, field installation pictures")
    documents: List[str] = Field(default_factory=list, description="User manuals, safety certificates, test reports")

    deployment_location: Optional[str] = Field(default=None, description="Physical site address or Panchayat name")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    deployment_date: Optional[str] = None

    status: SolutionStatus = SolutionStatus.PROTOTYPE

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
