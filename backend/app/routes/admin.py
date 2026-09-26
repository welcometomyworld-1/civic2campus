import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_role
from app.models.user import UserRole, AccountStatus
from app.schemas.user import UserProfileResponse
from app.schemas.admin import (
    AdminUserStatusUpdateRequest,
    AdminOrganizationReviewRequest,
    AuditLogListResponse,
)
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService

logger = logging.getLogger("civic2campus.routes.admin")

router = APIRouter(prefix="/admin", tags=["Admin & Governance"])


@router.get(
    "/stats",
    summary="Get System Statistics for Admin Command Center",
    description="Returns high-level statistics across all entities directly from MongoDB."
)
async def get_admin_stats(
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    return await AdminService.get_system_stats(db)


@router.get(
    "/users",
    summary="List Platform Users for Admin Review",
    description="Enables administrator to browse, filter by role or status, and search users."
)
async def list_admin_users(
    role: Optional[str] = Query(None, description="Filter by role (CITIZEN, UNIVERSITY, INDUSTRY, GOVERNMENT)"),
    status: Optional[str] = Query(None, description="Filter by status (ACTIVE, SUSPENDED, PENDING_APPROVAL)"),
    search: Optional[str] = Query(None, description="Keyword search in email or organization"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    return await AdminService.list_users(
        db=db,
        role=role,
        status_filter=status,
        page=page,
        limit=limit,
        search=search
    )


@router.put(
    "/users/{user_id}/status",
    summary="Update User Account Status",
    description="Allows administrator to activate, suspend, or update a user account."
)
async def update_user_status(
    user_id: str,
    payload: AdminUserStatusUpdateRequest,
    request: Request,
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    client_ip = request.client.host if request.client else None
    return await AdminService.update_user_status(
        db=db,
        user_id=user_id,
        new_status=payload.status,
        reason=payload.reason,
        admin_user=admin_user,
        ip_address=client_ip
    )


@router.put(
    "/organizations/{org_id}/approve",
    summary="Approve Organization Account",
    description="Approves verification for university or industry organization accounts."
)
async def approve_organization(
    org_id: str,
    payload: Optional[AdminOrganizationReviewRequest] = None,
    request: Request = None,
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    client_ip = request.client.host if request and request.client else None
    notes = payload.verification_notes if payload else "Approved by Platform Administrator"
    return await AdminService.review_organization(
        db=db,
        org_id=org_id,
        action="APPROVE",
        verification_notes=notes,
        rejection_reason=None,
        admin_user=admin_user,
        ip_address=client_ip
    )


@router.put(
    "/organizations/{org_id}/reject",
    summary="Reject Organization Account",
    description="Rejects verification for university or industry organization accounts."
)
async def reject_organization(
    org_id: str,
    payload: Optional[AdminOrganizationReviewRequest] = None,
    request: Request = None,
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    client_ip = request.client.host if request and request.client else None
    reason = payload.rejection_reason if payload else "Documentation insufficient"
    return await AdminService.review_organization(
        db=db,
        org_id=org_id,
        action="REJECT",
        verification_notes=None,
        rejection_reason=reason,
        admin_user=admin_user,
        ip_address=client_ip
    )


@router.get(
    "/problems",
    summary="Admin Monitor: All Problems",
    description="Allows administrators to audit and oversee all submitted civic issues."
)
async def list_admin_problems(
    status: Optional[str] = Query(None, description="Filter by status"),
    category: Optional[str] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    return await AdminService.list_admin_problems(
        db=db,
        page=page,
        limit=limit,
        status_filter=status,
        category=category
    )


@router.get(
    "/projects",
    summary="Admin Monitor: All R&D Projects",
    description="Provides administrative visibility into R&D squads and active project milestones."
)
async def list_admin_projects(
    status: Optional[str] = Query(None, description="Filter by project status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    return await AdminService.list_admin_projects(
        db=db,
        page=page,
        limit=limit,
        status_filter=status
    )


@router.get(
    "/solutions",
    summary="Admin Monitor: All Solutions",
    description="Lists all deployed solutions, prototypes, and field deployments across Jharkhand."
)
async def list_admin_solutions(
    status: Optional[str] = Query(None, description="Filter by solution status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    return await AdminService.list_admin_solutions(
        db=db,
        page=page,
        limit=limit,
        status_filter=status
    )


@router.get(
    "/audit-logs",
    response_model=AuditLogListResponse,
    summary="Query System Audit Trail",
    description="Returns security and administrative audit logs for compliance tracking."
)
async def get_audit_logs(
    action: Optional[str] = Query(None, description="Filter by action code"),
    resource_type: Optional[str] = Query(None, description="Filter by resource type"),
    user_id: Optional[str] = Query(None, description="Filter by actor user ID"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin_user: UserProfileResponse = Depends(require_role(UserRole.ADMIN)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AuditLogListResponse:
    return await AuditService.list_logs(
        db=db,
        action=action,
        resource_type=resource_type,
        user_id=user_id,
        page=page,
        limit=limit
    )
