from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.matching import TargetType, MatchStatus, ScoreBreakdown


class MatchResponse(BaseModel):
    """
    Standard API response representing a matched University squad or Industry partner.
    """
    id: str = Field(description="Unique Match ID")
    problem_id: str
    problem_title: Optional[str] = None
    problem_category: Optional[str] = None

    target_type: TargetType
    target_id: str = Field(description="Organization User ID")
    target_name: str
    target_email: Optional[str] = None

    # Step 5 exact naming aliases for frontend compatibility
    organization_id: str = Field(description="Organization ID (alias of target_id)")
    organization_name: str = Field(description="Organization Name (alias of target_name)")

    match_score: float = Field(description="Match Percentage (0-100)")
    score_breakdown: ScoreBreakdown
    matching_reason: str = Field(description="Primary summary reason for this match")
    reasons: List[str] = Field(default_factory=list, description="All matching factors explained")

    matched_expertise: List[str] = Field(default_factory=list)
    matched_domains: List[str] = Field(default_factory=list)
    matched_keywords: List[str] = Field(default_factory=list)
    location_distance: Optional[float] = Field(default=None, description="Distance in km (location_distance)")
    location_distance_km: Optional[float] = Field(default=None, description="Distance in km")

    status: MatchStatus
    response_note: Optional[str] = None
    is_semantic: bool = Field(default=True)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True



class ProblemRecommendationResponse(BaseModel):
    """
    Personalized civic challenge recommended to a logged-in University or Industry partner.
    """
    problem_id: str
    problem_title: str
    category: str
    urgency: str
    district: str
    city: str
    affected_people: Optional[str] = None
    match_score: float
    score_breakdown: ScoreBreakdown
    matched_expertise: List[str]
    matched_domains: List[str]
    distance_km: Optional[float] = None
    matching_reason: str
    match_status: MatchStatus
    match_id: str


class ExpressInterestRequest(BaseModel):
    """
    Payload when a university squad or industry sponsor accepts a match challenge.
    """
    note: Optional[str] = Field(default="Our team is eager to prototype a solution for this civic challenge.", description="Collaboration proposal message")
    estimated_timeline_weeks: Optional[int] = Field(default=8, description="Estimated prototype build duration")
    squad_lead: Optional[str] = Field(default=None, description="Faculty mentor or CSR lead name")


class RejectMatchRequest(BaseModel):
    """
    Payload when rejecting a recommended problem opportunity.
    """
    reason: Optional[str] = Field(default="Capacity limit or domain mismatch", description="Reason for declining match")
