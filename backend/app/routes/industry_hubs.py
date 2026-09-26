import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import get_optional_current_user, get_current_user
from app.models.user import UserRole
from app.schemas.user import UserProfileResponse
from app.services.industry_hub_service import IndustryHubService

logger = logging.getLogger("civic2campus.routes.industry_hubs")

router = APIRouter(prefix="/industry", tags=["Industry Dashboard Hubs"])


def _get_fallback_industry(current_user: Optional[UserProfileResponse]) -> UserProfileResponse:
    if current_user:
        return current_user
    return UserProfileResponse(
        id="seed_tata_steel",
        name="Tata Steel CSR Foundation",
        email="csr.jharkhand@tatasteel.com",
        role=UserRole.INDUSTRY,
        status="ACTIVE",
        is_verified=True,
        created_at="2026-09-17T02:00:00Z",
        updated_at="2026-09-17T02:00:00Z"
    )


# -----------------------------------------------------------------------------
# 1. CSR FUNDING HUB
# -----------------------------------------------------------------------------
@router.get("/csr/summary", summary="Get CSR Summary KPIs")
async def get_csr_summary(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_csr_summary(db=db, current_user=user)


@router.get("/csr", summary="List Industry CSR Funding Commitments")
async def list_csr_fundings(
    status: Optional[str] = Query(None),
    support_type: Optional[str] = Query(None),
    project: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.list_csr_fundings(
        db=db,
        current_user=user,
        status_filter=status,
        support_type=support_type,
        project=project,
        search=search,
        limit=limit,
        skip=skip
    )


@router.get("/csr/{id}", summary="Get CSR Funding Details by ID")
async def get_csr_funding(
    id: str,
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_csr_funding_by_id(db=db, funding_id=id, current_user=user)


@router.post("/csr", summary="Create New CSR Funding Allocation", status_code=status.HTTP_201_CREATED)
async def create_csr_funding(
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.create_csr_funding(db=db, current_user=user, payload=payload)


@router.put("/csr/{id}", summary="Update CSR Funding Record")
async def update_csr_funding(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.update_csr_funding(db=db, funding_id=id, current_user=user, payload=payload)


@router.put("/csr/{id}/status", summary="Update CSR Funding Status")
async def update_csr_funding_status(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="'status' field is required")
    note = payload.get("note")
    return await IndustryHubService.update_csr_funding_status(
        db=db,
        funding_id=id,
        current_user=user,
        new_status=new_status,
        note=note
    )


# -----------------------------------------------------------------------------
# 2. TECH SUPPORT HUB
# -----------------------------------------------------------------------------
@router.get("/tech-support", summary="List Technical Support Engagements")
async def list_tech_supports(
    status: Optional[str] = Query(None),
    support_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.list_tech_supports(
        db=db,
        current_user=user,
        status_filter=status,
        support_type=support_type,
        search=search,
        limit=limit,
        skip=skip
    )


@router.get("/tech-support/{id}", summary="Get Technical Support Details by ID")
async def get_tech_support(
    id: str,
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_tech_support_by_id(db=db, support_id=id, current_user=user)


@router.post("/tech-support", summary="Create / Provide Technical Support", status_code=status.HTTP_201_CREATED)
async def create_tech_support(
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.create_tech_support(db=db, current_user=user, payload=payload)


@router.put("/tech-support/{id}", summary="Update Technical Support Engagement")
async def update_tech_support(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.update_tech_support(db=db, support_id=id, current_user=user, payload=payload)


@router.post("/tech-support/{id}/tasks", summary="Add Task to Tech Support")
async def add_tech_support_task(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.add_tech_support_task(db=db, support_id=id, current_user=user, payload=payload)


@router.put("/tech-support/{id}/status", summary="Update Tech Support Status")
async def update_tech_support_status(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="'status' field is required")
    note = payload.get("note")
    return await IndustryHubService.update_tech_support_status(
        db=db,
        support_id=id,
        current_user=user,
        new_status=new_status,
        note=note
    )


# -----------------------------------------------------------------------------
# 3. SOLUTIONS HUB
# -----------------------------------------------------------------------------
@router.get("/solutions", summary="List Industry Supported Solutions")
async def list_industry_solutions(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.list_industry_solutions(
        db=db,
        current_user=user,
        status_filter=status,
        search=search,
        limit=limit,
        skip=skip
    )


@router.get("/solutions/{id}", summary="Get Solution Details by ID")
async def get_industry_solution(
    id: str,
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_solution_by_id(db=db, solution_id=id, current_user=user)


@router.post("/solutions", summary="Register Solution / Pilot", status_code=status.HTTP_201_CREATED)
async def create_industry_solution(
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.create_industry_solution(db=db, current_user=user, payload=payload)


@router.put("/solutions/{id}", summary="Update Industry Solution")
async def update_industry_solution(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.update_industry_solution(db=db, solution_id=id, current_user=user, payload=payload)


@router.put("/solutions/{id}/status", summary="Update Solution Status")
async def update_industry_solution_status(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="'status' field is required")
    return await IndustryHubService.update_industry_solution_status(
        db=db,
        solution_id=id,
        current_user=user,
        new_status=new_status
    )


@router.post("/solutions/{id}/testing", summary="Add Testing Run Record")
async def add_industry_solution_testing(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.add_industry_solution_testing(db=db, solution_id=id, current_user=user, payload=payload)


@router.post("/solutions/{id}/deployment", summary="Add Field Deployment Record")
async def add_industry_solution_deployment(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.add_industry_solution_deployment(db=db, solution_id=id, current_user=user, payload=payload)


# -----------------------------------------------------------------------------
# 4. IMPACT HUB
# -----------------------------------------------------------------------------
@router.get("/impact/summary", summary="Get Industry Impact Summary KPIs")
async def get_industry_impact_summary(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_impact_summary(db=db, current_user=user)


@router.get("/impact/projects", summary="Get Supported Projects Impact")
async def get_industry_impact_projects(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_impact_projects(db=db, current_user=user)


@router.get("/impact/solutions", summary="Get Supported Solutions Impact")
async def get_industry_impact_solutions(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_impact_solutions(db=db, current_user=user)


@router.get("/impact/csr", summary="Get CSR Impact Distribution")
async def get_industry_impact_csr(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_impact_csr(db=db, current_user=user)


@router.get("/impact/technical-support", summary="Get Tech Support Telemetry")
async def get_industry_impact_tech_support(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_impact_technical_support(db=db, current_user=user)


@router.get("/impact/timeline", summary="Get Industry Impact Timeline & Chart Datasets")
async def get_industry_impact_timeline(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_impact_timeline(db=db, current_user=user)


# -----------------------------------------------------------------------------
# 5. COMPANY PROFILE HUB
# -----------------------------------------------------------------------------
@router.get("/profile", summary="Get Authenticated Industry Profile")
async def get_industry_profile(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.get_industry_profile(db=db, current_user=user)


@router.put("/profile", summary="Update Industry Profile")
async def update_industry_profile(
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    return await IndustryHubService.update_industry_profile(db=db, current_user=user, payload=payload)


@router.post("/profile/logo", summary="Update Industry Logo URL")
async def update_industry_logo(
    payload: Dict[str, str],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_industry(current_user)
    logo_url = payload.get("logo_url")
    if not logo_url:
        raise HTTPException(status_code=400, detail="'logo_url' is required")
    return await IndustryHubService.update_industry_logo(db=db, current_user=user, logo_url=logo_url)
