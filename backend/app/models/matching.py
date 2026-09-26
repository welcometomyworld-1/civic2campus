from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class TargetType(str, Enum):
    """
    Target organization type for problem matching.
    """
    UNIVERSITY = "university"
    INDUSTRY = "industry"


class MatchStatus(str, Enum):
    """
    Status of an automated or evaluated match proposal.
    """
    PROPOSED = "PROPOSED"
    INTERESTED = "INTERESTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    COLLABORATING = "COLLABORATING"


class ScoreBreakdown(BaseModel):
    """
    Transparent breakdown of the composite matching score.
    """
    expertise_score: float = Field(description="Score component from required skills/expertise (0-40)")
    domain_score: float = Field(description="Score component from research/sub-domain match (0-20)")
    technology_score: float = Field(description="Score component from tech capabilities (0-15)")
    location_score: float = Field(description="Score component from geographical proximity (0-10)")
    keyword_score: float = Field(description="Score component from semantic keyword matching (0-10)")
    availability_score: float = Field(description="Score component from capacity & verification (0-5)")
    total_score: float = Field(description="Total composite score out of 100")


class MatchDocument(BaseModel):
    """
    MongoDB Document Schema for the 'matches' collection.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    problem_id: str = Field(description="Target Problem ObjectId string")
    problem_title: Optional[str] = None
    problem_category: Optional[str] = None

    target_type: TargetType
    target_id: str = Field(description="University or Industry User/Organization ObjectId string")
    target_name: str
    target_email: Optional[str] = None

    score: float = Field(description="Match Percentage (0-100)")
    score_breakdown: ScoreBreakdown
    reasons: List[str] = Field(default_factory=list)

    matched_skills: List[str] = Field(default_factory=list)
    matched_domains: List[str] = Field(default_factory=list)
    matched_keywords: List[str] = Field(default_factory=list)
    distance_km: Optional[float] = None

    status: MatchStatus = MatchStatus.PROPOSED
    response_note: Optional[str] = None
    is_semantic: bool = Field(default=True, description="True if semantic/AI matched, False if heuristic")

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
