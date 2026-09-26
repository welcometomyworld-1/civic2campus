import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.schemas.user import UserProfileResponse
from app.schemas.ai_analysis import (
    AIAnalysisResponse,
    RndBriefResponse,
    DuplicateDetectionResponse,
    TriggerAnalysisResponse,
)
from app.services.ai_service import AIService

logger = logging.getLogger("civic2campus.routes.ai")

router = APIRouter(prefix="/ai", tags=["AI Analysis & R&D Brief Engine"])


# -----------------------------------------------------------------------------
# 1. TRIGGER AI ANALYSIS ON PROBLEM
# -----------------------------------------------------------------------------
@router.post(
    "/analyze/{problem_id}",
    response_model=AIAnalysisResponse,
    summary="Trigger AI Analysis on Problem",
    description="Executes classification, urgency scoring, duplicate detection, and 10-point R&D brief generation."
)
async def trigger_problem_analysis(
    problem_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AIAnalysisResponse:
    """
    Manually triggers or refreshes AI analysis for a reported problem.
    """
    return await AIService.analyze_problem(db, problem_id)


# -----------------------------------------------------------------------------
# 2. GET FULL AI ANALYSIS RESULT
# -----------------------------------------------------------------------------
@router.get(
    "/analysis/{problem_id}",
    response_model=AIAnalysisResponse,
    summary="Get Full AI Analysis",
    description="Retrieves classification, skill requirements, priority breakdown, and R&D brief for a problem."
)
async def get_problem_analysis(
    problem_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AIAnalysisResponse:
    """
    Returns complete AI Analysis document. If not yet analyzed, automatically processes on demand.
    """
    return await AIService.get_analysis_by_problem_id(db, problem_id)


# -----------------------------------------------------------------------------
# 3. GET 10-POINT R&D BRIEF FOR UNIVERSITIES & INDUSTRY
# -----------------------------------------------------------------------------
@router.get(
    "/analysis/{problem_id}/rnd-brief",
    response_model=RndBriefResponse,
    summary="Get 10-Point Academic R&D Brief",
    description="Extracts clean 10-point research brief designed for university engineering squads and CSR sponsors."
)
async def get_rnd_brief(
    problem_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> RndBriefResponse:
    """
    Provides standard academic brief format:
    1. Problem Statement
    2. Current Situation
    3. Key Challenges
    4. Required Expertise
    5. Suggested Research Area
    6. Suggested Technology Areas
    7. Potential Solution Direction
    8. Stakeholders
    9. Expected Impact
    10. Relevant Keywords
    """
    return await AIService.get_rnd_brief_by_problem_id(db, problem_id)


# -----------------------------------------------------------------------------
# 4. DETECT DUPLICATE & SIMILAR PROBLEMS
# -----------------------------------------------------------------------------
@router.get(
    "/duplicates/{problem_id}",
    response_model=DuplicateDetectionResponse,
    summary="Detect Duplicate & Similar Problems",
    description="Scans existing MongoDB problem repository to detect semantic overlaps and nearby duplicates."
)
async def detect_problem_duplicates(
    problem_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> DuplicateDetectionResponse:
    """
    Returns duplicate probability score and linked cluster problems.
    """
    return await AIService.detect_duplicates(db, problem_id)
