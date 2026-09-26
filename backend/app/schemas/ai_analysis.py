from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.ai_analysis import AnalysisStatus, RndBrief


class AIAnalysisResponse(BaseModel):
    """
    Standard API response containing AI analysis results and R&D brief.
    """
    id: str = Field(description="AI Analysis Record ObjectId")
    problem_id: str = Field(description="Associated Problem ID")

    category: str
    subcategory: Optional[str] = None
    priority: str
    priority_reason: str
    confidence: float
    problem_type: str
    affected_domain: str

    required_expertise: List[str]
    suggested_research_domains: List[str]
    suggested_solution_areas: List[str]

    similar_problem_ids: List[str] = Field(default_factory=list)
    duplicate_probability: float = Field(default=0.0)
    similarity_reasons: Optional[List[str]] = Field(default_factory=list)

    rnd_brief: RndBrief

    status: AnalysisStatus
    provider: str
    is_fallback: bool
    error_message: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RndBriefResponse(BaseModel):
    """
    Clean 10-point R&D Brief DTO for university squads and CSR donors.
    """
    problem_id: str
    problem_title: str
    category: str
    priority: str
    rnd_brief: RndBrief
    generated_by: str
    is_fallback: bool
    created_at: datetime


class DuplicateDetectionResponse(BaseModel):
    """
    Response returned by duplicate & semantic similarity detection.
    """
    problem_id: str
    duplicate_probability: float
    is_likely_duplicate: bool
    similar_problems: List[Dict[str, Any]]
    reasons: List[str]


class TriggerAnalysisResponse(BaseModel):
    """
    Response returned when triggering AI analysis.
    """
    success: bool
    message: str
    problem_id: str
    status: AnalysisStatus
    analysis_id: Optional[str] = None
