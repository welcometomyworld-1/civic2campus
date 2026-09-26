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
from app.models.project import ProjectStatus
from app.schemas.user import UserProfileResponse
from app.schemas.project import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
    MilestoneCreateRequest,
    ProjectResponse,
    ProjectListResponse,
)
from app.services.project_service import ProjectService

logger = logging.getLogger("civic2campus.routes.projects")

router = APIRouter(prefix="/projects", tags=["R&D Projects & Milestones"])


# -----------------------------------------------------------------------------
# 1. CREATE PROJECT
# -----------------------------------------------------------------------------
@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Civic Engineering Project",
    description="Initializes an R&D prototyping project with milestones, faculty mentors, and deliverables."
)
async def create_project(
    payload: ProjectCreateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProjectResponse:
    """
    Protected project creation route.
    """
    return await ProjectService.create_project(db, current_user, payload)


# -----------------------------------------------------------------------------
# 2. LIST PROJECTS
# -----------------------------------------------------------------------------
@router.get(
    "",
    response_model=ProjectListResponse,
    summary="List / Explore Projects",
    description="Queries ongoing and completed civic engineering projects."
)
async def list_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    problem_id: Optional[str] = Query(None, description="Filter by problem ID"),
    collaboration_id: Optional[str] = Query(None, description="Filter by collaboration ID"),
    university_id: Optional[str] = Query(None, description="Filter by University ID"),
    industry_id: Optional[str] = Query(None, description="Filter by Industry ID"),
    status: Optional[ProjectStatus] = Query(None, description="Filter by project status"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProjectListResponse:
    """
    Project directory endpoint.
    """
    return await ProjectService.list_projects(
        db=db,
        page=page,
        limit=limit,
        problem_id=problem_id,
        collaboration_id=collaboration_id,
        university_id=university_id,
        industry_id=industry_id,
        status_filter=status
    )


# -----------------------------------------------------------------------------
# 3. GET SINGLE PROJECT
# -----------------------------------------------------------------------------
@router.get(
    "/{id}",
    response_model=ProjectResponse,
    summary="Get Project by ID",
    description="Retrieves comprehensive technical milestones, team members, documents, and progress."
)
async def get_project_by_id(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProjectResponse:
    """
    Single project view.
    """
    return await ProjectService.get_project_by_id(db, id)


# -----------------------------------------------------------------------------
# 4. UPDATE PROJECT
# -----------------------------------------------------------------------------
@router.put(
    "/{id}",
    response_model=ProjectResponse,
    summary="Update Project Details",
    description="Updates progress percentage, uploaded CAD/reports, or status."
)
async def update_project(
    id: str,
    payload: ProjectUpdateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProjectResponse:
    """
    Protected project update route.
    """
    return await ProjectService.update_project(db, id, current_user, payload)


# -----------------------------------------------------------------------------
# 5. DELETE PROJECT
# -----------------------------------------------------------------------------
@router.delete(
    "/{id}",
    summary="Delete Project",
    description="Removes a project record from platform."
)
async def delete_project(
    id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    """
    Protected project deletion route.
    """
    return await ProjectService.delete_project(db, id, current_user)


# -----------------------------------------------------------------------------
# 6. ADD MILESTONE TO PROJECT
# -----------------------------------------------------------------------------
@router.post(
    "/{id}/milestones",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Deliverable Milestone",
    description="Adds a deliverable milestone with target due date and recalculates overall project completion progress."
)
async def add_milestone(
    id: str,
    payload: MilestoneCreateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProjectResponse:
    """
    Protected milestone creation route.
    """
    return await ProjectService.add_milestone(db, id, current_user, payload)
