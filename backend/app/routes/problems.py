import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, BackgroundTasks, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import (
    get_current_user,
    require_role,
    require_citizen,
    require_admin,
    require_government,
)
from app.models.user import UserRole
from app.models.problem import ProblemCategory, ProblemStatus, UrgencyLevel
from app.schemas.user import UserProfileResponse
from app.schemas.problem import (
    ProblemCreateRequest,
    ProblemUpdateRequest,
    ProblemResponse,
    ProblemListResponse,
    EvidenceUploadResponse,
)
from app.services.problem_service import ProblemService
from app.services.ai_service import AIService

logger = logging.getLogger("civic2campus.routes.problems")

router = APIRouter(prefix="/problems", tags=["Community Problem Reporting"])


# -----------------------------------------------------------------------------
# 1. CREATE PROBLEM (WITH AUTOMATIC ASYNC AI TRIGGER)
# -----------------------------------------------------------------------------
@router.post(
    "",
    response_model=ProblemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Report a Community Problem",
    description="Allows citizens, student scouts, or officials to report a localized civic problem. Automatically triggers background AI analysis."
)
async def create_problem(
    payload: ProblemCreateRequest,
    background_tasks: BackgroundTasks,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProblemResponse:
    """
    Submits a new problem. Automatically builds GeoJSON geometry and schedules AI analysis in the background.
    """
    new_problem = await ProblemService.create_problem(db, current_user, payload)

    # Trigger non-blocking AI analysis in background
    background_tasks.add_task(AIService.run_background_analysis, db, new_problem.id)

    return new_problem


# -----------------------------------------------------------------------------
# 2. UPLOAD EVIDENCE (MEDIA / PDF / VIDEO)
# -----------------------------------------------------------------------------
@router.post(
    "/upload-evidence",
    response_model=EvidenceUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Photo/Video/PDF Evidence",
    description="Validates and stores evidence files on local storage, returning the media URL."
)
async def upload_evidence(
    file: UploadFile = File(...),
    current_user: UserProfileResponse = Depends(get_current_user)
) -> EvidenceUploadResponse:
    """
    Uploads supporting evidence. Enforces file extension and maximum 25MB size limits.
    """
    return await ProblemService.save_evidence_file(file)


# -----------------------------------------------------------------------------
# 3. GET NEARBY PROBLEMS (GEOSPATIAL QUERY)
# -----------------------------------------------------------------------------
@router.get(
    "/nearby",
    response_model=List[ProblemResponse],
    summary="Find Nearby Problems (Geospatial $nearSphere)",
    description="Queries problems within a given radius in kilometers from given GPS coordinates."
)
async def get_nearby_problems(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude (e.g. 23.3441)"),
    lng: float = Query(..., ge=-180.0, le=180.0, description="Longitude (e.g. 85.3096)"),
    radius_km: float = Query(25.0, gt=0, le=500.0, description="Search radius in kilometers"),
    category: Optional[ProblemCategory] = Query(None, description="Optional category filter"),
    status: Optional[ProblemStatus] = Query(None, description="Optional status filter"),
    limit: int = Query(30, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[ProblemResponse]:
    """
    Geospatial discovery endpoint powering the Civic Innovation Map.
    """
    return await ProblemService.get_nearby_problems(
        db=db,
        latitude=lat,
        longitude=lng,
        radius_km=radius_km,
        category=category,
        status_filter=status,
        limit=limit
    )


# -----------------------------------------------------------------------------
# 4. GET MY REPORTED PROBLEMS
# -----------------------------------------------------------------------------
@router.get(
    "/my",
    response_model=ProblemListResponse,
    summary="Get My Reported Problems",
    description="Retrieves all problems submitted by the currently logged-in citizen."
)
async def get_my_problems(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProblemListResponse:
    """
    Citizen personal problem tracking list.
    """
    return await ProblemService.get_my_problems(db, current_user, page=page, limit=limit)


# -----------------------------------------------------------------------------
# 5. GET HIGH PRIORITY PROBLEMS
# -----------------------------------------------------------------------------
@router.get(
    "/high-priority",
    response_model=List[ProblemResponse],
    summary="Get High Priority & Critical Problems",
    description="Returns high-urgency community issues requiring fast university squad intervention."
)
async def get_high_priority_problems(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[ProblemResponse]:
    """
    Highlights urgent civic issues across Jharkhand.
    """
    return await ProblemService.get_high_priority_problems(db, limit=limit)


# -----------------------------------------------------------------------------
# 6. GET PROBLEMS BY CATEGORY
# -----------------------------------------------------------------------------
@router.get(
    "/category/{category}",
    response_model=ProblemListResponse,
    summary="Get Problems by Category",
    description="Filters problems belonging to a specific domain (e.g. 'Water & Sanitation')."
)
async def get_problems_by_category(
    category: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProblemListResponse:
    """
    Domain-specific stream.
    """
    return await ProblemService.get_problems_by_category(db, category, page=page, limit=limit)


# -----------------------------------------------------------------------------
# 7. LIST PROBLEMS (WITH MULTI-FILTER & PAGINATION)
# -----------------------------------------------------------------------------
@router.get(
    "",
    response_model=ProblemListResponse,
    summary="Explore / Search Community Problems",
    description="Public explorer listing problems with multi-parameter filtering and pagination."
)
async def list_problems(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    category: Optional[ProblemCategory] = Query(None, description="Category filter"),
    status: Optional[ProblemStatus] = Query(None, description="Status filter"),
    urgency: Optional[UrgencyLevel] = Query(None, description="Urgency filter"),
    district: Optional[str] = Query(None, description="Jharkhand district name (e.g. Ranchi, Khunti, Dhanbad)"),
    city: Optional[str] = Query(None, description="City / Block name"),
    search: Optional[str] = Query(None, description="Keyword text search on title, description, address"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProblemListResponse:
    """
    Powers the Explore Problems page and state overview.
    """
    return await ProblemService.list_problems(
        db=db,
        page=page,
        limit=limit,
        category=category,
        status_filter=status,
        urgency=urgency,
        district=district,
        city=city,
        search=search
    )


# -----------------------------------------------------------------------------
# 8. GET SINGLE PROBLEM DETAIL
# -----------------------------------------------------------------------------
@router.get(
    "/{problem_id}",
    response_model=ProblemResponse,
    summary="Get Problem Details by ID",
    description="Fetches comprehensive details, location, and evidence for a specific problem."
)
async def get_problem_by_id(
    problem_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProblemResponse:
    """
    Individual problem detail view.
    """
    return await ProblemService.get_problem_by_id(db, problem_id)


# -----------------------------------------------------------------------------
# 9. UPDATE PROBLEM
# -----------------------------------------------------------------------------
@router.put(
    "/{problem_id}",
    response_model=ProblemResponse,
    summary="Update Problem Report",
    description="Allows problem author, Government official, or Administrator to update details/status."
)
async def update_problem(
    problem_id: str,
    payload: ProblemUpdateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProblemResponse:
    """
    Protected update route.
    """
    return await ProblemService.update_problem(db, problem_id, current_user, payload)


# -----------------------------------------------------------------------------
# 10. DELETE PROBLEM
# -----------------------------------------------------------------------------
@router.delete(
    "/{problem_id}",
    summary="Delete Problem Report",
    description="Allows author or Administrator to remove a problem report."
)
async def delete_problem(
    problem_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    """
    Protected deletion route.
    """
    return await ProblemService.delete_problem(db, problem_id, current_user)
