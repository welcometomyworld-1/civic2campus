from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.problem import (
    ProblemCategory,
    UrgencyLevel,
    ProblemStatus,
    AIAnalysisStatus,
    ProblemLocation,
    ProblemEvidence,
    ReportedBySummary,
)


class LocationInput(BaseModel):
    """
    Geographical location input when submitting a community problem.
    """
    address: str = Field(min_length=2, description="Street / Village / Panchayat / Ward")
    city: str = Field(min_length=2, description="City / Block / Sub-division")
    district: str = Field(min_length=2, description="District in Jharkhand (e.g. Ranchi, Khunti, Dhanbad)")
    state: str = Field(default="Jharkhand")
    country: str = Field(default="India")
    latitude: float = Field(ge=-90.0, le=90.0, description="Latitude (e.g. 23.3441)")
    longitude: float = Field(ge=-180.0, le=180.0, description="Longitude (e.g. 85.3096)")


class EvidenceInput(BaseModel):
    """
    Evidence file reference uploaded via /api/problems/upload-evidence.
    """
    file_name: str
    file_url: str
    file_type: str = Field(description="'image', 'pdf', or 'video'")
    file_size_bytes: Optional[int] = None


class ProblemCreateRequest(BaseModel):
    """
    Payload for reporting a new grassroots community problem.
    """
    title: str = Field(min_length=5, max_length=200, description="Concise, clear problem title")
    description: str = Field(min_length=15, description="Detailed problem description")
    category: ProblemCategory = Field(description="Primary category")
    sub_category: Optional[str] = None
    affected_people: Optional[str] = Field(default=None, description="e.g. '~500 villagers / 120 households'")
    affected_area: Optional[str] = Field(default=None, description="e.g. 'Ward 4 & adjacent primary school'")
    frequency: Optional[str] = Field(default="Daily", description="e.g. 'Daily', 'Seasonal monsoon', 'Continuous'")
    urgency: UrgencyLevel = Field(default=UrgencyLevel.MEDIUM, description="Urgency: LOW, MEDIUM, HIGH, CRITICAL")
    location: LocationInput
    evidence: List[EvidenceInput] = Field(default_factory=list, description="Array of photo/video evidence")
    reference_number: Optional[str] = Field(default=None, description="Prior departmental complaint reference if any")


class ProblemUpdateRequest(BaseModel):
    """
    Payload for updating an existing problem.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[ProblemCategory] = None
    sub_category: Optional[str] = None
    urgency: Optional[UrgencyLevel] = None
    status: Optional[ProblemStatus] = None
    affected_people: Optional[str] = None
    affected_area: Optional[str] = None
    frequency: Optional[str] = None
    location: Optional[LocationInput] = None
    evidence: Optional[List[EvidenceInput]] = None


class ProblemResponse(BaseModel):
    """
    Standardized API response representing a civic problem.
    """
    id: str
    title: str
    description: str
    category: ProblemCategory
    sub_category: Optional[str] = None
    affected_people: Optional[str] = None
    affected_area: Optional[str] = None
    frequency: Optional[str] = None
    urgency: UrgencyLevel
    location: ProblemLocation
    evidence: List[ProblemEvidence] = Field(default_factory=list)
    reported_by: ReportedBySummary
    status: ProblemStatus
    ai_analysis_status: AIAnalysisStatus
    priority_score: int
    upvotes: int = 0
    reference_number: Optional[str] = None
    distance_km: Optional[float] = Field(default=None, description="Distance in KM when queried via /nearby")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProblemListResponse(BaseModel):
    """
    Paginated response for problem collections.
    """
    total: int
    page: int
    limit: int
    total_pages: int
    items: List[ProblemResponse]


class EvidenceUploadResponse(BaseModel):
    """
    Response returned after successful evidence file upload.
    """
    file_name: str
    file_url: str
    file_type: str
    file_size_bytes: int
    content_type: str
