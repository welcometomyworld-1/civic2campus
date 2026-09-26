from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ProblemCategory(str, Enum):
    """
    Standard Civic Problem Categories across Jharkhand.
    """
    WATER_SANITATION = "Water & Sanitation"
    WASTE_MANAGEMENT = "Waste Management"
    EDUCATION = "Education"
    HEALTHCARE = "Healthcare"
    TRANSPORTATION = "Transportation"
    INFRASTRUCTURE = "Infrastructure"
    ENVIRONMENT = "Environment"
    AGRICULTURE = "Agriculture"
    PUBLIC_SAFETY = "Public Safety"
    OTHER = "Other"


class UrgencyLevel(str, Enum):
    """
    Severity rating indicating how quickly intervention is required.
    """
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ProblemStatus(str, Enum):
    """
    Lifecycle stages for problem resolution in Civic2Campus ecosystem.
    """
    SUBMITTED = "SUBMITTED"
    AI_ANALYSIS = "AI_ANALYSIS"
    MATCHING = "MATCHING"
    COLLABORATION = "COLLABORATION"
    SOLUTION = "SOLUTION"
    DEPLOYED = "DEPLOYED"
    CLOSED = "CLOSED"


class AIAnalysisStatus(str, Enum):
    """
    Status of AI Engine R&D Brief extraction (prepared for Step 4).
    """
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ProblemLocation(BaseModel):
    """
    Geographical location payload with GeoJSON point mapping for geospatial indexes.
    """
    address: str = Field(description="Street / Village / Ward name")
    city: str = Field(description="City or Block name")
    district: str = Field(description="Jharkhand District name")
    state: str = Field(default="Jharkhand")
    country: str = Field(default="India")
    latitude: float = Field(ge=-90.0, le=90.0, description="Latitude coordinate")
    longitude: float = Field(ge=-180.0, le=180.0, description="Longitude coordinate")
    geo: Optional[Dict[str, Any]] = Field(
        default=None,
        description="GeoJSON representation for MongoDB 2dsphere index: {'type': 'Point', 'coordinates': [lng, lat]}"
    )


class ProblemEvidence(BaseModel):
    """
    Media evidence attachment (photos, video footage, supporting official PDFs).
    """
    file_name: str
    file_url: str
    file_type: str = Field(description="'image', 'pdf', or 'video'")
    file_size_bytes: Optional[int] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class ReportedBySummary(BaseModel):
    """
    Embedded summary of reporting citizen or official.
    """
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None


class ProblemDocument(BaseModel):
    """
    Complete MongoDB Problem Document representation.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    title: str = Field(min_length=5, max_length=200)
    description: str = Field(min_length=15)
    category: ProblemCategory
    sub_category: Optional[str] = None

    # Demographics & Impact parameters
    affected_people: Optional[str] = None
    affected_area: Optional[str] = None
    frequency: Optional[str] = None
    urgency: UrgencyLevel = UrgencyLevel.MEDIUM

    # Location & Media
    location: ProblemLocation
    evidence: List[ProblemEvidence] = Field(default_factory=list)
    reported_by: ReportedBySummary

    # Progress Tracking & AI Readiness
    status: ProblemStatus = ProblemStatus.SUBMITTED
    ai_analysis_status: AIAnalysisStatus = AIAnalysisStatus.PENDING
    priority_score: int = Field(default=50, description="Priority rating from 1 to 100")

    # Community verification
    upvotes: int = 0
    upvoted_by: List[str] = Field(default_factory=list)
    reference_number: Optional[str] = None

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
