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
from app.models.collaboration import CollaborationStatus
from app.schemas.user import UserProfileResponse
from app.schemas.collaboration import (
    CollaborationCreateRequest,
    CollaborationUpdateRequest,
    CollaborationApproveRequest,
    CollaborationResponse,
    CollaborationListResponse,
)
from app.services.collaboration_service import CollaborationService

logger = logging.getLogger("civic2campus.routes.collaborations")

router = APIRouter(prefix="/collaborations", tags=["Collaborations & Squads"])


# -----------------------------------------------------------------------------
# 1. CREATE COLLABORATION PROPOSAL
# -----------------------------------------------------------------------------
@router.post(
    "",
    response_model=CollaborationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Propose a Multi-Stakeholder Collaboration",
    description="Initiates a collaborative R&D squad uniting university faculty/students, corporate CSR sponsors, and community reporters."
)
async def create_collaboration(
    payload: CollaborationCreateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> CollaborationResponse:
    """
    Protected creation endpoint. Requires authenticated user.
    """
    return await CollaborationService.create_collaboration(db, current_user, payload)


# -----------------------------------------------------------------------------
# 2. LIST COLLABORATIONS
# -----------------------------------------------------------------------------
@router.get(
    "",
    response_model=CollaborationListResponse,
    summary="Explore / List Collaborations",
    description="Lists active and proposed collaborations with multi-criteria filtering and pagination."
)
async def list_collaborations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    problem_id: Optional[str] = Query(None, description="Filter by problem ID"),
    status: Optional[CollaborationStatus] = Query(None, description="Filter by collaboration status"),
    university_id: Optional[str] = Query(None, description="Filter by University ID"),
    industry_id: Optional[str] = Query(None, description="Filter by Industry ID"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> CollaborationListResponse:
    """
    Public / Authenticated collaboration explorer.
    """
    return await CollaborationService.list_collaborations(
        db=db,
        page=page,
        limit=limit,
        problem_id=problem_id,
        status_filter=status,
        university_id=university_id,
        industry_id=industry_id
    )


# -----------------------------------------------------------------------------
# 3. GET SINGLE COLLABORATION DETAILS
# -----------------------------------------------------------------------------
@router.get(
    "/{id}",
    response_model=CollaborationResponse,
    summary="Get Collaboration Details by ID",
    description="Fetches squad member roster, linked civic problem, deliverables, and progress."
)
async def get_collaboration_by_id(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> CollaborationResponse:
    """
    Individual collaboration detail view.
    """
    return await CollaborationService.get_collaboration_by_id(db, id)


# -----------------------------------------------------------------------------
# 4. UPDATE COLLABORATION
# -----------------------------------------------------------------------------
@router.put(
    "/{id}",
    response_model=CollaborationResponse,
    summary="Update Collaboration Details",
    description="Updates deliverables, squad members, or status."
)
async def update_collaboration(
    id: str,
    payload: CollaborationUpdateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> CollaborationResponse:
    """
    Protected update route.
    """
    return await CollaborationService.update_collaboration(db, id, current_user, payload)


# -----------------------------------------------------------------------------
# 5. APPROVE COLLABORATION
# -----------------------------------------------------------------------------
@router.post(
    "/{id}/approve",
    response_model=CollaborationResponse,
    summary="Approve Collaboration Proposal",
    description="Approves a proposed collaboration to unlock active prototype development."
)
async def approve_collaboration(
    id: str,
    payload: CollaborationApproveRequest = CollaborationApproveRequest(),
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> CollaborationResponse:
    """
    Protected approval route for partners or admins.
    """
    return await CollaborationService.approve_collaboration(db, id, current_user, payload)
