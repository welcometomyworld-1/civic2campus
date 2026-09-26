import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config.settings import get_settings
from app.models.user import UserRole, AccountStatus, UserDocument
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    CitizenRegisterRequest,
    UniversityRegisterRequest,
    IndustryRegisterRequest,
    GovernmentRegisterRequest,
    RegisterRequestUnion,
    AdminApprovalRequest,
)
from app.schemas.user import UserProfileResponse
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    create_password_reset_token,
    decode_token,
    invalidate_token,
)
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService
from app.models.notification import NotificationType

logger = logging.getLogger("civic2campus.auth_service")


class AuthService:
    """
    Core business logic for user registration, authentication, RBAC, and credential verification.
    """

    @staticmethod
    def _doc_to_user_profile(doc: Dict[str, Any]) -> UserProfileResponse:
        """
        Transforms MongoDB raw document (with _id: ObjectId) into a clean UserProfileResponse.
        """
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]
        # Ensure password_hash is omitted
        doc_copy.pop("password_hash", None)
        return UserProfileResponse(**doc_copy)

    @classmethod
    async def register_user(
        cls,
        db: AsyncIOMotorDatabase,
        payload: RegisterRequestUnion
    ) -> UserProfileResponse:
        """
        Registers a new user or organization with appropriate role verification status.
        """
        users_col = db["users"]

        # 1. Determine target email based on role
        email = getattr(payload, "official_email", getattr(payload, "email", None))
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Valid email address is required for registration."
            )

        email_clean = str(email).strip().lower()

        # 2. Check if user already exists
        existing_user = await users_col.find_one({"email": email_clean})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"An account with email '{email_clean}' already exists."
            )

        # 3. Disallow public admin registration
        if payload.role == UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrator accounts cannot be created through public registration."
            )

        # 4. Hash password securely
        password_hashed = hash_password(payload.password)
        now = datetime.utcnow()

        # 5. Build Document Structure based on Role
        if payload.role == UserRole.CITIZEN:
            assert isinstance(payload, CitizenRegisterRequest)
            user_dict = {
                "role": UserRole.CITIZEN.value,
                "name": payload.name.strip(),
                "email": email_clean,
                "phone": payload.phone.strip(),
                "password_hash": password_hashed,
                "profile_image": payload.profile_photo,
                "location": payload.location.strip(),
                "city": payload.city.strip(),
                "state": payload.state.strip(),
                "country": "India",
                "status": AccountStatus.ACTIVE.value,  # Citizen is active immediately
                "is_verified": True,
                "verification_status": "Approved",
                "created_at": now,
                "updated_at": now,
                "last_login": None
            }

        elif payload.role == UserRole.UNIVERSITY:
            assert isinstance(payload, UniversityRegisterRequest)
            user_dict = {
                "role": UserRole.UNIVERSITY.value,
                "name": payload.university_name.strip(),
                "organization_name": payload.university_name.strip(),
                "email": email_clean,
                "official_email": email_clean,
                "contact_person": payload.contact_person.strip(),
                "phone": payload.phone.strip(),
                "department": payload.department.strip() if payload.department else None,
                "university_type": payload.university_type,
                "website": payload.website.strip() if payload.website else None,
                "expertise": payload.domains,
                "domains": payload.domains,
                "profile_image": payload.logo,
                "university_logo": payload.logo,
                "location": f"{payload.city}, {payload.state}",
                "city": payload.city.strip(),
                "state": payload.state.strip(),
                "country": "India",
                "password_hash": password_hashed,
                "status": AccountStatus.PENDING.value,  # University requires verification
                "is_verified": False,
                "verification_status": "Pending Verification",
                "created_at": now,
                "updated_at": now,
                "last_login": None
            }

        elif payload.role == UserRole.INDUSTRY:
            assert isinstance(payload, IndustryRegisterRequest)
            user_dict = {
                "role": UserRole.INDUSTRY.value,
                "name": payload.company_name.strip(),
                "company_name": payload.company_name.strip(),
                "email": email_clean,
                "official_email": email_clean,
                "contact_person": payload.contact_person.strip(),
                "designation": payload.designation.strip(),
                "phone": payload.phone.strip(),
                "industry_type": payload.industry_type,
                "location": payload.location.strip() if payload.location else f"{payload.city}, {payload.state}",
                "city": payload.city.strip(),
                "state": payload.state.strip(),
                "country": "India",
                "website": payload.website.strip() if payload.website else None,
                "expertise": payload.expertise,
                "support_available": payload.support_available,
                "profile_image": payload.logo,
                "company_logo": payload.logo,
                "password_hash": password_hashed,
                "status": AccountStatus.PENDING.value,  # Industry requires verification
                "is_verified": False,
                "verification_status": "Pending Verification",
                "created_at": now,
                "updated_at": now,
                "last_login": None
            }

        elif payload.role == UserRole.GOVERNMENT:
            assert isinstance(payload, GovernmentRegisterRequest)
            user_dict = {
                "role": UserRole.GOVERNMENT.value,
                "name": payload.department_name.strip(),
                "organization_name": payload.department_name.strip(),
                "email": email_clean,
                "official_email": email_clean,
                "authorized_person": payload.authorized_person.strip(),
                "designation": payload.designation.strip(),
                "phone": payload.phone.strip(),
                "department": payload.department_name.strip(),
                "department_category": payload.department_category.strip(),
                "location": f"{payload.city}, {payload.state}",
                "city": payload.city.strip(),
                "state": payload.state.strip(),
                "country": "India",
                "password_hash": password_hashed,
                "status": AccountStatus.PENDING.value,  # Government requires Admin verification
                "is_verified": False,
                "verification_status": "Pending Verification",
                "created_at": now,
                "updated_at": now,
                "last_login": None
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported role: {payload.role}"
            )

        # 6. Insert into MongoDB
        result = await users_col.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id

        # Audit Log & Notification
        try:
            await AuditService.log_action(
                db=db,
                user_id=str(result.inserted_id),
                user_email=email_clean,
                user_role=payload.role.value if hasattr(payload.role, "value") else str(payload.role),
                action="USER_REGISTRATION",
                resource_type="USER",
                resource_id=str(result.inserted_id),
                metadata={"role": str(payload.role), "status": user_dict.get("status")}
            )
            await NotificationService.create_notification(
                db=db,
                user_id=str(result.inserted_id),
                notification_type=NotificationType.PROBLEM_SUBMITTED,
                title="Welcome to Civic2Campus!",
                message=f"Welcome to the Civic2Campus platform as a registered {str(payload.role)}. Explore community problems and active R&D squads.",
                related_id=str(result.inserted_id),
                related_type="USER"
            )
        except Exception as log_err:
            logger.warning(f"Registration audit/notification note: {log_err}")

        logger.info(f"Successfully registered user {email_clean} ({payload.role}) ID: {result.inserted_id}")
        return cls._doc_to_user_profile(user_dict)

    @classmethod
    async def authenticate_user(
        cls,
        db: AsyncIOMotorDatabase,
        login_data: LoginRequest
    ) -> TokenResponse:
        """
        Validates login credentials and returns JWT access & refresh tokens.
        """
        settings = get_settings()
        users_col = db["users"]
        email_clean = login_data.email.strip().lower()

        # Find user document
        user = await users_col.find_one({"email": email_clean})
        if not user:
            logger.warning(f"Failed login attempt for non-existent email: {email_clean}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Check password hash
        if not verify_password(login_data.password, user.get("password_hash", "")):
            logger.warning(f"Failed password check for user: {email_clean}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Check account status
        account_status = user.get("status", AccountStatus.ACTIVE.value)
        if account_status == AccountStatus.SUSPENDED.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been suspended by the platform administrator. Contact support."
            )
        elif account_status == AccountStatus.REJECTED.value:
            reason = user.get("rejection_reason", "Official verification was not approved.")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your registration was rejected. Reason: {reason}"
            )

        # Update last_login timestamp
        now = datetime.utcnow()
        await users_col.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": now, "updated_at": now}}
        )
        user["last_login"] = now

        # Generate JWT tokens
        token_payload = {
            "sub": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
            "name": user.get("name", "")
        }

        access_token = create_access_token(token_payload)
        refresh_token = create_refresh_token(token_payload)

        user_profile = cls._doc_to_user_profile(user)

        # Audit Log login event
        try:
            await AuditService.log_action(
                db=db,
                user_id=str(user["_id"]),
                user_email=user.get("email"),
                user_role=user.get("role"),
                action="USER_LOGIN",
                resource_type="AUTH",
                resource_id=str(user["_id"]),
                metadata={"role": user.get("role")}
            )
        except Exception as log_err:
            logger.warning(f"Login audit note: {log_err}")

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
            user=user_profile
        )

    @classmethod
    async def get_user_by_id(
        cls,
        db: AsyncIOMotorDatabase,
        user_id: str
    ) -> Optional[UserProfileResponse]:
        """
        Retrieves a user profile by MongoDB ObjectId string.
        """
        users_col = db["users"]
        try:
            obj_id = ObjectId(user_id)
        except Exception:
            return None

        user = await users_col.find_one({"_id": obj_id})
        if not user:
            return None
        return cls._doc_to_user_profile(user)

    @classmethod
    async def refresh_access_token(
        cls,
        db: AsyncIOMotorDatabase,
        refresh_token: str
    ) -> TokenResponse:
        """
        Validates refresh token and issues a new access token.
        """
        settings = get_settings()
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject.")

        user_profile = await cls.get_user_by_id(db, user_id)
        if not user_profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        # Re-issue access token
        new_claims = {
            "sub": user_profile.id,
            "email": user_profile.email,
            "role": user_profile.role.value,
            "name": user_profile.name
        }
        new_access_token = create_access_token(new_claims)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
            user=user_profile
        )

    @classmethod
    async def handle_forgot_password(
        cls,
        db: AsyncIOMotorDatabase,
        email: str
    ) -> Dict[str, Any]:
        """
        Initiates password reset flow and produces a reset token.
        """
        users_col = db["users"]
        email_clean = email.strip().lower()
        user = await users_col.find_one({"email": email_clean})

        # Return identical safe response to prevent email enumeration
        safe_response = {
            "success": True,
            "message": "If an account exists with this email, a password reset link will be sent."
        }

        if user:
            reset_token = create_password_reset_token(email_clean)
            # In production, dispatch email with reset link
            # For hackathon/demo, we return the reset_token in response metadata
            safe_response["data"] = {
                "reset_token": reset_token,
                "note": "Prototype mode: use this token with /api/auth/reset-password"
            }
            logger.info(f"Password reset token issued for: {email_clean}")

        return safe_response

    @classmethod
    async def handle_reset_password(
        cls,
        db: AsyncIOMotorDatabase,
        token: str,
        new_password: str
    ) -> Dict[str, Any]:
        """
        Resets user password using validated reset token.
        """
        payload = decode_token(token)
        if not payload or payload.get("type") != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid, expired, or malformed password reset token."
            )

        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload.")

        users_col = db["users"]
        new_hash = hash_password(new_password)
        now = datetime.utcnow()

        result = await users_col.update_one(
            {"email": email},
            {"$set": {"password_hash": new_hash, "updated_at": now}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

        # Invalidate reset token
        invalidate_token(token)
        logger.info(f"Password successfully reset for: {email}")

        return {
            "success": True,
            "message": "Password has been successfully updated. You may now sign in with your new credentials."
        }

    @classmethod
    async def admin_review_user(
        cls,
        db: AsyncIOMotorDatabase,
        approval_data: AdminApprovalRequest
    ) -> UserProfileResponse:
        """
        Allows Administrator to approve, reject, or suspend organization registrations.
        """
        users_col = db["users"]
        try:
            obj_id = ObjectId(approval_data.user_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format.")

        now = datetime.utcnow()
        action = approval_data.action.upper()

        if action == "APPROVE":
            update_fields = {
                "status": AccountStatus.ACTIVE.value,
                "is_verified": True,
                "verification_status": "Approved",
                "rejection_reason": None,
                "updated_at": now
            }
        elif action == "REJECT":
            update_fields = {
                "status": AccountStatus.REJECTED.value,
                "is_verified": False,
                "verification_status": "Rejected",
                "rejection_reason": approval_data.reason or "Does not meet institutional eligibility criteria",
                "updated_at": now
            }
        elif action == "SUSPEND":
            update_fields = {
                "status": AccountStatus.SUSPENDED.value,
                "is_verified": False,
                "verification_status": "Suspended",
                "rejection_reason": approval_data.reason or "Account suspended by Administrator",
                "updated_at": now
            }
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action.")

        result = await users_col.find_one_and_update(
            {"_id": obj_id},
            {"$set": update_fields},
            return_document=True
        )

        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target user not found.")

        logger.info(f"Admin updated user {approval_data.user_id} status to: {action}")
        return cls._doc_to_user_profile(result)

    @classmethod
    async def seed_admin_user_if_needed(cls, db: AsyncIOMotorDatabase) -> None:
        """
        Ensures a default super-administrator account exists in the database.
        """
        settings = get_settings()
        users_col = db["users"]
        admin_email = settings.ADMIN_EMAIL.strip().lower()

        existing_admin = await users_col.find_one({"email": admin_email})
        if not existing_admin:
            now = datetime.utcnow()
            admin_doc = {
                "role": UserRole.ADMIN.value,
                "name": settings.ADMIN_NAME,
                "email": admin_email,
                "phone": "+91 94311 00001",
                "password_hash": hash_password(settings.ADMIN_PASSWORD),
                "location": "State Secretariat, Ranchi",
                "city": "Ranchi",
                "state": "Jharkhand",
                "country": "India",
                "status": AccountStatus.ACTIVE.value,
                "is_verified": True,
                "verification_status": "Approved",
                "department": "State IT & Innovation Directorate",
                "created_at": now,
                "updated_at": now,
                "last_login": None
            }
            await users_col.insert_one(admin_doc)
            logger.info(f"Seeded default platform Admin account: {admin_email}")
