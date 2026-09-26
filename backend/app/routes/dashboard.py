import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import (
    get_current_user,
    get_optional_current_user,
    require_role,
    require_admin,
    require_citizen,
    require_university,
    require_industry,
    require_government,
)
from app.models.user import UserRole
from app.schemas.user import UserProfileResponse
from app.schemas.dashboard import (
    CitizenDashboardResponse,
    UniversityDashboardResponse,
    IndustryDashboardResponse,
    GovernmentDashboardResponse,
    AdminDashboardResponse,
)
from app.services.dashboard_service import DashboardService

logger = logging.getLogger("civic2campus.routes.dashboard")

router = APIRouter(prefix="/dashboard", tags=["Dashboard Analytics & Live KPIs"])


# -----------------------------------------------------------------------------
# 1. CITIZEN DASHBOARD
# -----------------------------------------------------------------------------
@router.get(
    "/citizen",
    response_model=CitizenDashboardResponse,
    summary="Citizen Dashboard & Problem Lifecycle Tracker",
    description="Returns live counts of problems reported, under AI analysis, active in prototyping squads, and resolved with deployed solutions."
)
async def get_citizen_dashboard(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> CitizenDashboardResponse:
    """
    Personalized citizen KPIs.
    """
    return await DashboardService.get_citizen_dashboard(db, current_user)


# -----------------------------------------------------------------------------
# 2. UNIVERSITY DASHBOARD
# -----------------------------------------------------------------------------
@router.get(
    "/university",
    response_model=UniversityDashboardResponse,
    summary="University R&D & Squad Management Dashboard",
    description="Returns live metrics on matched civic challenges, active prototyping projects, student teams, collaborations, and deployed solutions."
)
async def get_university_dashboard(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> UniversityDashboardResponse:
    """
    University department & innovation cell KPIs.
    """
    # Create fallback profile if accessing anonymously
    if not current_user:
        current_user = UserProfileResponse(
            id="seed_bit_mesra",
            name="BIT Mesra Innovation Lab",
            email="innovator@bitmesra.ac.in",
            role=UserRole.UNIVERSITY,
            status="ACTIVE",
            is_verified=True,
            created_at="2026-09-17T02:00:00Z",
            updated_at="2026-09-17T02:00:00Z"
        )
    return await DashboardService.get_university_dashboard(db, current_user)


# -----------------------------------------------------------------------------
# 3. INDUSTRY DASHBOARD
# -----------------------------------------------------------------------------
@router.get(
    "/industry",
    response_model=IndustryDashboardResponse,
    summary="Industry CSR & Sponsorship Dashboard",
    description="Returns live metrics on matched CSR opportunities, active partnerships, funded engineering projects, and university connections."
)
async def get_industry_dashboard(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> IndustryDashboardResponse:
    """
    Industry CSR & Mentorship KPIs.
    """
    if not current_user:
        current_user = UserProfileResponse(
            id="seed_tata_csr",
            name="Tata Steel CSR Foundation",
            email="csr.jharkhand@tatasteel.com",
            role=UserRole.INDUSTRY,
            status="ACTIVE",
            is_verified=True,
            created_at="2026-09-17T02:00:00Z",
            updated_at="2026-09-17T02:00:00Z"
        )
    return await DashboardService.get_industry_dashboard(db, current_user)


# -----------------------------------------------------------------------------
# 4. GOVERNMENT DASHBOARD
# -----------------------------------------------------------------------------
@router.get(
    "/government",
    response_model=GovernmentDashboardResponse,
    summary="State-Wide Civic Innovation & Governance Dashboard",
    description="Returns aggregate state-level problem metrics, high-priority issues, active engineering projects, deployed solutions, and district summaries."
)
async def get_government_dashboard(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> GovernmentDashboardResponse:
    """
    Government monitoring and public health/infrastructure impact overview.
    """
    return await DashboardService.get_government_dashboard(db, current_user)


# -----------------------------------------------------------------------------
# 5. ADMIN DASHBOARD
# -----------------------------------------------------------------------------
@router.get(
    "/admin",
    response_model=AdminDashboardResponse,
    summary="Platform Administrator Overview",
    description="Returns complete system-wide user counts, problem counts, project counts, AI analyses, and cumulative citizens benefited."
)
async def get_admin_dashboard(
    current_user: UserProfileResponse = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AdminDashboardResponse:
    """
    Admin control metrics. Requires Admin role.
    """
    return await DashboardService.get_admin_dashboard(db, current_user)
