import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import (
    get_current_user,
    get_optional_current_user,
    require_role,
)
from app.models.user import UserRole
from app.models.solution import SolutionStatus
from app.schemas.user import UserProfileResponse
from app.schemas.solution import (
    SolutionCreateRequest,
    SolutionUpdateRequest,
    SolutionResponse,
    SolutionListResponse,
)
from app.schemas.impact import (
    ImpactCreateRequest,
    ImpactResponse,
)
from app.services.solution_service import SolutionService

logger = logging.getLogger("civic2campus.routes.solutions")

router = APIRouter(prefix="/solutions", tags=["Solutions & Impact Tracking"])


# -----------------------------------------------------------------------------
# 1. CREATE SOLUTION
# -----------------------------------------------------------------------------
@router.post(
    "",
    response_model=SolutionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a Field Solution / Prototype",
    description="Registers a field-tested prototype or deployed engineering solution for a community problem."
)
async def create_solution(
    payload: SolutionCreateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> SolutionResponse:
    """
    Protected solution submission route.
    """
    return await SolutionService.create_solution(db, current_user, payload)


# -----------------------------------------------------------------------------
# 2. LIST SOLUTIONS
# -----------------------------------------------------------------------------
@router.get(
    "",
    response_model=SolutionListResponse,
    summary="Explore Verified Solutions",
    description="Directory of open-source and deployed civic engineering solutions."
)
async def list_solutions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    problem_id: Optional[str] = Query(None, description="Filter by problem ID"),
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    status: Optional[SolutionStatus] = Query(None, description="Filter by solution status"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> SolutionListResponse:
    """
    Public solutions explorer.
    """
    return await SolutionService.list_solutions(
        db=db,
        page=page,
        limit=limit,
        problem_id=problem_id,
        project_id=project_id,
        status_filter=status
    )


# -----------------------------------------------------------------------------
# 3. GET SINGLE SOLUTION
# -----------------------------------------------------------------------------
@router.get(
    "/{id}",
    response_model=SolutionResponse,
    summary="Get Solution Details by ID",
    description="Retrieves technical overview, CAD/testing reports, deployment coordinates, and status."
)
async def get_solution_by_id(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> SolutionResponse:
    """
    Single solution view.
    """
    return await SolutionService.get_solution_by_id(db, id)


# -----------------------------------------------------------------------------
# 4. UPDATE SOLUTION
# -----------------------------------------------------------------------------
@router.put(
    "/{id}",
    response_model=SolutionResponse,
    summary="Update Solution Deployment Status",
    description="Updates deployment status (e.g. TESTING -> DEPLOYED), location coordinates, or photos."
)
async def update_solution(
    id: str,
    payload: SolutionUpdateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> SolutionResponse:
    """
    Protected update route.
    """
    return await SolutionService.update_solution(db, id, current_user, payload)


# -----------------------------------------------------------------------------
# 5. POST IMPACT METRICS
# -----------------------------------------------------------------------------
@router.post(
    "/{id}/impact",
    response_model=ImpactResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit / Update Post-Deployment Impact Metrics",
    description="Records verified field impact indicators (people benefited, water/cost saved, health improvements)."
)
async def record_impact_metrics(
    id: str,
    payload: ImpactCreateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ImpactResponse:
    """
    Protected impact reporting route.
    """
    return await SolutionService.create_or_update_impact(db, id, current_user, payload)


# -----------------------------------------------------------------------------
# 6. GET IMPACT METRICS
# -----------------------------------------------------------------------------
@router.get(
    "/{id}/impact",
    response_model=ImpactResponse,
    summary="Get Verified Field Impact Metrics",
    description="Fetches people benefited, area covered, and qualitative health/economic impacts."
)
async def get_impact_metrics(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ImpactResponse:
    """
    Public impact metrics view.
    """
    return await SolutionService.get_impact_by_solution_id(db, id)
