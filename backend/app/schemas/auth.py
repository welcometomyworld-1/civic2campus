from typing import Optional, List, Union, Literal
from pydantic import BaseModel, EmailStr, Field, model_validator
from app.models.user import UserRole, AccountStatus
from app.schemas.user import UserProfileResponse


# -----------------------------------------------------------------------------
# LOGIN & TOKEN SCHEMAS
# -----------------------------------------------------------------------------
class LoginRequest(BaseModel):
    """
    Standard login credentials.
    """
    email: EmailStr = Field(description="Registered user or organization email")
    password: str = Field(min_length=4, description="Account password")
    remember_me: bool = Field(default=True, description="Extend session flag")


class TokenResponse(BaseModel):
    """
    Standardized JWT Authentication response with user context.
    """
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: UserProfileResponse


class RefreshTokenRequest(BaseModel):
    """
    Request to exchange valid refresh token for a new access token.
    """
    refresh_token: str


class AuthMessageResponse(BaseModel):
    """
    Generic message response for auth operations (logout, password reset request, etc.).
    """
    success: bool
    message: str
    data: Optional[dict] = None


# -----------------------------------------------------------------------------
# REGISTRATION SCHEMAS (ROLE-SPECIFIC)
# -----------------------------------------------------------------------------
class BaseRegisterRequest(BaseModel):
    """
    Base registration schema containing common validation rules.
    """
    password: str = Field(min_length=8, description="Minimum 8 characters password")
    confirm_password: str = Field(min_length=8, description="Must match password")
    agree_terms: bool = Field(default=True, description="Terms acceptance")

    @model_validator(mode="after")
    def check_passwords_match(self) -> "BaseRegisterRequest":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match. Please verify.")
        if not self.agree_terms:
            raise ValueError("You must agree to the Terms & Privacy Policy to create an account.")
        return self


class CitizenRegisterRequest(BaseRegisterRequest):
    """
    Payload for Grassroots Citizen Registration.
    """
    role: Literal[UserRole.CITIZEN] = UserRole.CITIZEN
    name: str = Field(min_length=2, description="Citizen full name")
    email: EmailStr = Field(description="Personal email address")
    phone: str = Field(min_length=10, description="Mobile contact number")
    location: str = Field(description="Village / Panchayat / Ward")
    city: str = Field(description="District / City name")
    state: str = Field(default="Jharkhand")
    profile_photo: Optional[str] = None


class UniversityRegisterRequest(BaseRegisterRequest):
    """
    Payload for Academic University / College Registration.
    """
    role: Literal[UserRole.UNIVERSITY] = UserRole.UNIVERSITY
    university_name: str = Field(min_length=3, description="University / Institution name")
    official_email: EmailStr = Field(description="Official academic email domain (.ac.in / .edu)")
    contact_person: str = Field(min_length=2, description="Faculty lead / Dean / Nodal officer name")
    phone: str = Field(min_length=10, description="Contact phone number")
    department: Optional[str] = Field(default="Department of Engineering / Computer Science")
    university_type: Optional[str] = Field(default="State / Central / CFTI University")
    city: str = Field(description="Campus City / District")
    state: str = Field(default="Jharkhand")
    website: Optional[str] = None
    domains: List[str] = Field(default_factory=list, description="Expertise domains (AI/ML, IoT, Water, etc.)")
    logo: Optional[str] = None


class IndustryRegisterRequest(BaseRegisterRequest):
    """
    Payload for Industry & CSR Partner Registration.
    """
    role: Literal[UserRole.INDUSTRY] = UserRole.INDUSTRY
    company_name: str = Field(min_length=2, description="Corporate / Enterprise name")
    official_email: EmailStr = Field(description="Corporate business email")
    contact_person: str = Field(min_length=2, description="Representative / Lead name")
    designation: str = Field(description="Official designation (e.g. Head of CSR)")
    phone: str = Field(min_length=10, description="Official phone number")
    industry_type: Optional[str] = Field(default="Technology & Manufacturing")
    location: Optional[str] = Field(default=None, description="Plant / Office location")
    city: str = Field(description="Headquarters city")
    state: str = Field(default="Jharkhand")
    website: Optional[str] = None
    expertise: List[str] = Field(default_factory=list, description="Industry sector expertise")
    support_available: List[str] = Field(default_factory=list, description="CSR, Mentorship, Prototyping grants")
    logo: Optional[str] = None


class GovernmentRegisterRequest(BaseRegisterRequest):
    """
    Payload for Government Line-Department Registration.
    """
    role: Literal[UserRole.GOVERNMENT] = UserRole.GOVERNMENT
    department_name: str = Field(min_length=3, description="Department / Line Agency name")
    official_email: EmailStr = Field(description="Official government email (.gov.in / .nic.in)")
    authorized_person: str = Field(min_length=2, description="Authorized IAS/BDO/DC representative name")
    designation: str = Field(description="Official administrative designation")
    phone: str = Field(min_length=10, description="Official phone number")
    department_category: str = Field(description="Portfolio (e.g. Drinking Water, Health, Energy, Road)")
    city: str = Field(description="Secretariat / District jurisdiction HQ")
    state: str = Field(default="Jharkhand")


# Unified registration schema union
RegisterRequestUnion = Union[
    CitizenRegisterRequest,
    UniversityRegisterRequest,
    IndustryRegisterRequest,
    GovernmentRegisterRequest
]


# -----------------------------------------------------------------------------
# PASSWORD RESET SCHEMAS
# -----------------------------------------------------------------------------
class ForgotPasswordRequest(BaseModel):
    """
    Payload to request a password reset email token.
    """
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """
    Payload to reset password using token.
    """
    token: str = Field(description="Password reset JWT token")
    new_password: str = Field(min_length=8, description="New password minimum 8 chars")
    confirm_password: str = Field(min_length=8, description="Must match new_password")

    @model_validator(mode="after")
    def check_passwords_match(self) -> "ResetPasswordRequest":
        if self.new_password != self.confirm_password:
            raise ValueError("New password and confirm password do not match.")
        return self


# -----------------------------------------------------------------------------
# ADMIN VERIFICATION ACTION SCHEMAS
# -----------------------------------------------------------------------------
class AdminApprovalRequest(BaseModel):
    """
    Payload for Admin reviewing a pending organization registration.
    """
    user_id: str = Field(description="Target user MongoDB ID")
    action: Literal["APPROVE", "REJECT", "SUSPEND"] = Field(description="Approval decision")
    reason: Optional[str] = Field(default=None, description="Optional note / rejection reason")
