import logging
from typing import List, Callable, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.models.user import UserRole, AccountStatus
from app.schemas.user import UserProfileResponse
from app.services.auth_service import AuthService
from app.utils.security import decode_token

logger = logging.getLogger("civic2campus.auth_dependency")

# OAuth2 scheme for Swagger UI authorization button
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> UserProfileResponse:
    """
    FastAPI dependency that extracts and validates the Bearer JWT token
    and returns the authenticated user profile.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token contains no subject identifier.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await AuthService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with token was not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status == AccountStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended. Please contact platform administration.",
        )
    elif user.status == AccountStatus.REJECTED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Registration rejected: {user.rejection_reason or 'Eligibility criteria not met'}",
        )

    return user


def require_role(*allowed_roles: UserRole) -> Callable:
    """
    Higher-order dependency to enforce Role-Based Access Control (RBAC).
    Admins automatically bypass all single-role restrictions.
    """
    async def role_checker(
        current_user: UserProfileResponse = Depends(get_current_user)
    ) -> UserProfileResponse:
        # Admin has super-access
        if current_user.role == UserRole.ADMIN:
            return current_user

        if current_user.role not in allowed_roles:
            role_names = ", ".join([r.value.upper() for r in allowed_roles])
            logger.warning(
                f"Access denied for user {current_user.email} (Role: {current_user.role}). Required: {role_names}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. This endpoint requires one of the following roles: {role_names}."
            )
        return current_user

    return role_checker


async def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Optional[UserProfileResponse]:
    """
    Returns authenticated user if a valid token is provided, otherwise None.
    """
    if not token:
        return None
    try:
        return await get_current_user(token=token, db=db)
    except Exception:
        return None


# Convenient Role-Specific Dependency Shortcuts
require_admin = require_role(UserRole.ADMIN)
require_citizen = require_role(UserRole.CITIZEN)
require_university = require_role(UserRole.UNIVERSITY)
require_industry = require_role(UserRole.INDUSTRY)
require_government = require_role(UserRole.GOVERNMENT)
require_org = require_role(UserRole.UNIVERSITY, UserRole.INDUSTRY)

