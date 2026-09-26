from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole, AccountStatus


class UserProfileResponse(BaseModel):
    """
    Standardized, secure user profile representation returned by API endpoints.
    Guarantees password_hash is NEVER leaked.
    """
    id: str = Field(description="Unique MongoDB user identifier")
    role: UserRole
    name: str
    email: EmailStr
    phone: Optional[str] = None
    profile_image: Optional[str] = None

    # Location & Jurisdiction
    location: Optional[str] = None
    city: Optional[str] = None
    state: str = "Jharkhand"
    country: str = "India"

    # Status
    status: AccountStatus
    is_verified: bool
    verification_status: Optional[str] = None
    rejection_reason: Optional[str] = None

    # Role-Specific Attributes
    organization_name: Optional[str] = None
    official_email: Optional[EmailStr] = None
    contact_person: Optional[str] = None
    department: Optional[str] = None
    department_category: Optional[str] = None
    university_type: Optional[str] = None
    website: Optional[str] = None
    expertise: Optional[List[str]] = Field(default_factory=list)
    domains: Optional[List[str]] = Field(default_factory=list)
    company_name: Optional[str] = None
    designation: Optional[str] = None
    industry_type: Optional[str] = None
    support_available: Optional[List[str]] = Field(default_factory=list)
    authorized_person: Optional[str] = None

    # Timestamps
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    """
    Payload for updating user profile information.
    """
    name: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    website: Optional[str] = None
    expertise: Optional[List[str]] = None
    domains: Optional[List[str]] = None
    support_available: Optional[List[str]] = None
