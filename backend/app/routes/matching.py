import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import (
    get_current_user,
    get_optional_current_user,
    require_role,
    require_university,
    require_industry,
)
from app.models.user import UserRole
from app.models.matching import TargetType
from app.schemas.user import UserProfileResponse
from app.schemas.matching import (
    MatchResponse,
    ProblemRecommendationResponse,
    ExpressInterestRequest,
    RejectMatchRequest,
)
from app.services.matching_service import MatchingService

logger = logging.getLogger("civic2campus.routes.matching")

router = APIRouter(tags=["Smart University & Industry Matching"])


# -----------------------------------------------------------------------------
# 1. GET UNIVERSITY MATCHES FOR A COMMUNITY PROBLEM
# -----------------------------------------------------------------------------
@router.get(
    "/problems/{problem_id}/matches/universities",
    response_model=List[MatchResponse],
    summary="Get Top Matching University Squads for Problem",
    description="Analyzes the problem's AI R&D brief and scores candidate academic engineering squads based on faculty expertise, research domains, labs, and proximity."
)
async def get_university_matches_for_problem(
    problem_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[MatchResponse]:
    """
    Computes/retrieves ranked university squad matches for a specific community problem.
    """
    return await MatchingService.get_or_calculate_problem_matches(
        db=db,
        problem_id=problem_id,
        target_type=TargetType.UNIVERSITY
    )


# -----------------------------------------------------------------------------
# 2. GET INDUSTRY / CSR MATCHES FOR A COMMUNITY PROBLEM
# -----------------------------------------------------------------------------
@router.get(
    "/problems/{problem_id}/matches/industries",
    response_model=List[MatchResponse],
    summary="Get Top Matching Industry & CSR Sponsors for Problem",
    description="Scores candidate corporate CSR foundations, hardware sponsors, and industry labs based on sponsorship capability, domain alignment, and regional focus."
)
async def get_industry_matches_for_problem(
    problem_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[MatchResponse]:
    """
    Computes/retrieves ranked industry CSR and prototyping partner matches for a community problem.
    """
    return await MatchingService.get_or_calculate_problem_matches(
        db=db,
        problem_id=problem_id,
        target_type=TargetType.INDUSTRY
    )


# -----------------------------------------------------------------------------
# 3. GET PERSONALIZED RECOMMENDATIONS FOR UNIVERSITIES
# -----------------------------------------------------------------------------
@router.get(
    "/universities/recommendations",
    response_model=List[ProblemRecommendationResponse],
    summary="Get Recommended Civic Challenges for Universities",
    description="Returns ranked problem recommendations tailored for academic research squads and engineering departments."
)
async def get_university_recommendations(
    university_id: Optional[str] = Query(None, description="Optional specific University ID for simulated preview"),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[ProblemRecommendationResponse]:
    """
    Personalized civic challenges recommended to University innovators.
    """
    return await MatchingService.get_recommendations_for_organization(
        db=db,
        target_type=TargetType.UNIVERSITY,
        current_user=current_user,
        org_id=university_id
    )


# -----------------------------------------------------------------------------
# 4. GET PERSONALIZED RECOMMENDATIONS FOR INDUSTRIES
# -----------------------------------------------------------------------------
@router.get(
    "/industries/recommendations",
    response_model=List[ProblemRecommendationResponse],
    summary="Get Recommended Civic Challenges for Industry CSR",
    description="Returns ranked problem recommendations tailored for Industry CSR grantmakers, prototyping mentors, and tech sponsors."
)
async def get_industry_recommendations(
    industry_id: Optional[str] = Query(None, description="Optional specific Industry ID for simulated preview"),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[ProblemRecommendationResponse]:
    """
    Personalized civic challenges recommended to Industry CSR partners.
    """
    return await MatchingService.get_recommendations_for_organization(
        db=db,
        target_type=TargetType.INDUSTRY,
        current_user=current_user,
        org_id=industry_id
    )


# -----------------------------------------------------------------------------
# 5. EXPRESS INTEREST IN A MATCH / OPPORTUNITY
# -----------------------------------------------------------------------------
@router.post(
    "/matches/{match_id}/interest",
    response_model=MatchResponse,
    summary="Express Interest in Match Opportunity",
    description="Allows a University innovation squad or Industry CSR sponsor to accept a matched civic challenge and submit proposal details."
)
async def express_match_interest(
    match_id: str,
    payload: ExpressInterestRequest = ExpressInterestRequest(),
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> MatchResponse:
    """
    Marks a match proposal as INTERESTED and updates problem lifecycle status to COLLABORATION.
    """
    # Enforce role: University, Industry, or Administrator
    if current_user.role not in [UserRole.UNIVERSITY, UserRole.INDUSTRY, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only University squads or Industry sponsors can accept civic matches."
        )

    return await MatchingService.express_interest(
        db=db,
        match_id=match_id,
        current_user=current_user,
        payload=payload
    )


# -----------------------------------------------------------------------------
# 6. REJECT A MATCH / OPPORTUNITY
# -----------------------------------------------------------------------------
@router.post(
    "/matches/{match_id}/reject",
    response_model=MatchResponse,
    summary="Decline / Reject Match Opportunity",
    description="Allows an organization to pass on a matched civic challenge with an optional reason note."
)
async def reject_match_opportunity(
    match_id: str,
    payload: RejectMatchRequest = RejectMatchRequest(),
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> MatchResponse:
    """
    Marks a match record as REJECTED.
    """
    if current_user.role not in [UserRole.UNIVERSITY, UserRole.INDUSTRY, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only University squads or Industry sponsors can decline match opportunities."
        )

    return await MatchingService.reject_match(
        db=db,
        match_id=match_id,
        current_user=current_user,
        payload=payload
    )
