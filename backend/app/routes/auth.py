import logging
from typing import Dict, Any, Union
from fastapi import APIRouter, Depends, HTTPException, status, Header
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import (
    get_current_user,
    require_role,
    require_admin,
    require_citizen,
    require_university,
    require_industry,
    require_government,
)
from app.models.user import UserRole
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    CitizenRegisterRequest,
    UniversityRegisterRequest,
    IndustryRegisterRequest,
    GovernmentRegisterRequest,
    RegisterRequestUnion,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AdminApprovalRequest,
    AuthMessageResponse,
)
from app.schemas.user import UserProfileResponse
from app.services.auth_service import AuthService
from app.utils.security import invalidate_token

logger = logging.getLogger("civic2campus.routes.auth")

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])


# -----------------------------------------------------------------------------
# 1. USER REGISTRATION
# -----------------------------------------------------------------------------
@router.post(
    "/register",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User / Organization",
    description="Registers Citizen, University, Industry, or Government account with role-specific verification logic."
)
async def register_user(
    payload: Union[
        CitizenRegisterRequest,
        UniversityRegisterRequest,
        IndustryRegisterRequest,
        GovernmentRegisterRequest
    ],
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> UserProfileResponse:
    """
    Role-specific registration endpoint.
    - Citizen: Activated immediately.
    - University / Industry / Government: Status set to 'PENDING' for Admin verification.
    """
    return await AuthService.register_user(db, payload)


# -----------------------------------------------------------------------------
# 2. USER LOGIN
# -----------------------------------------------------------------------------
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User / Organization Login",
    description="Authenticates credentials and returns signed JWT access & refresh tokens."
)
async def login_user(
    login_data: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> TokenResponse:
    """
    Standard login with email & password.
    Returns Bearer tokens and user profile.
    """
    return await AuthService.authenticate_user(db, login_data)


# -----------------------------------------------------------------------------
# 3. GET CURRENT USER PROFILE
# -----------------------------------------------------------------------------
@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get Current User Profile",
    description="Returns the profile of the currently authenticated user based on JWT Bearer token."
)
async def get_me(
    current_user: UserProfileResponse = Depends(get_current_user)
) -> UserProfileResponse:
    """
    Protected route returning sanitized user profile without sensitive credentials.
    """
    return current_user


# -----------------------------------------------------------------------------
# 4. REFRESH ACCESS TOKEN
# -----------------------------------------------------------------------------
@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh Access Token",
    description="Exchanges a valid refresh token for a newly signed access token."
)
async def refresh_token(
    payload: RefreshTokenRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> TokenResponse:
    """
    Extends user session using valid refresh token.
    """
    return await AuthService.refresh_access_token(db, payload.refresh_token)


# -----------------------------------------------------------------------------
# 5. USER LOGOUT
# -----------------------------------------------------------------------------
@router.post(
    "/logout",
    response_model=AuthMessageResponse,
    summary="Logout User",
    description="Invalidates current session and blacklists the token."
)
async def logout_user(
    authorization: str = Header(None),
    current_user: UserProfileResponse = Depends(get_current_user)
) -> AuthMessageResponse:
    """
    Invalidates current access token.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        invalidate_token(token)

    return AuthMessageResponse(
        success=True,
        message=f"User {current_user.email} logged out successfully. Token invalidated."
    )


# -----------------------------------------------------------------------------
# 6. FORGOT & RESET PASSWORD
# -----------------------------------------------------------------------------
@router.post(
    "/forgot-password",
    response_model=AuthMessageResponse,
    summary="Forgot Password Request",
    description="Generates a secure password reset token if account exists."
)
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AuthMessageResponse:
    """
    Initiates password recovery procedure.
    """
    result = await AuthService.handle_forgot_password(db, payload.email)
    return AuthMessageResponse(
        success=result["success"],
        message=result["message"],
        data=result.get("data")
    )


@router.post(
    "/reset-password",
    response_model=AuthMessageResponse,
    summary="Reset Password with Token",
    description="Updates password using a valid password reset token."
)
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AuthMessageResponse:
    """
    Validates token and updates user password hash.
    """
    result = await AuthService.handle_reset_password(db, payload.token, payload.new_password)
    return AuthMessageResponse(
        success=result["success"],
        message=result["message"]
    )


# -----------------------------------------------------------------------------
# 7. ADMIN VERIFICATION & OVERSIGHT
# -----------------------------------------------------------------------------
@router.post(
    "/admin/verify",
    response_model=UserProfileResponse,
    summary="Admin Account Verification",
    description="Allows Administrator to APPROVE, REJECT, or SUSPEND an organization account."
)
async def admin_verify_account(
    payload: AdminApprovalRequest,
    admin_user: UserProfileResponse = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> UserProfileResponse:
    """
    Restricted to Admin role only.
    """
    return await AuthService.admin_review_user(db, payload)


# -----------------------------------------------------------------------------
# 8. ROLE-RESTRICTION DEMONSTRATION ENDPOINTS
# -----------------------------------------------------------------------------
@router.get(
    "/test/citizen-only",
    summary="Citizen Role Check Test",
    description="Protected endpoint accessible only by Citizen and Admin users."
)
async def test_citizen_endpoint(
    user: UserProfileResponse = Depends(require_citizen)
) -> Dict[str, Any]:
    return {
        "success": True,
        "message": f"Welcome Citizen {user.name}! Access granted to citizen problem reporting stream.",
        "user_id": user.id,
        "role": user.role
    }


@router.get(
    "/test/university-only",
    summary="University Role Check Test",
    description="Protected endpoint accessible only by University and Admin users."
)
async def test_university_endpoint(
    user: UserProfileResponse = Depends(require_university)
) -> Dict[str, Any]:
    return {
        "success": True,
        "message": f"Welcome University {user.organization_name or user.name}! Access granted to R&D workspace.",
        "user_id": user.id,
        "role": user.role
    }


@router.get(
    "/test/industry-only",
    summary="Industry Role Check Test",
    description="Protected endpoint accessible only by Industry and Admin users."
)
async def test_industry_endpoint(
    user: UserProfileResponse = Depends(require_industry)
) -> Dict[str, Any]:
    return {
        "success": True,
        "message": f"Welcome Industry Partner {user.company_name or user.name}! Access granted to CSR co-funding portal.",
        "user_id": user.id,
        "role": user.role
    }


@router.get(
    "/test/government-only",
    summary="Government Role Check Test",
    description="Protected endpoint accessible only by Government and Admin users."
)
async def test_government_endpoint(
    user: UserProfileResponse = Depends(require_government)
) -> Dict[str, Any]:
    return {
        "success": True,
        "message": f"Welcome Official {user.name} ({user.department})! Access granted to Command Center.",
        "user_id": user.id,
        "role": user.role
    }


@router.get(
    "/test/admin-only",
    summary="Admin Role Check Test",
    description="Protected endpoint strictly accessible by Administrator."
)
async def test_admin_endpoint(
    user: UserProfileResponse = Depends(require_admin)
) -> Dict[str, Any]:
    return {
        "success": True,
        "message": f"Welcome Administrator {user.name}! Access granted to state oversight management.",
        "user_id": user.id,
        "role": user.role
    }
