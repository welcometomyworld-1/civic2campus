from enum import Enum
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    """
    Supported User Roles in Civic2Campus platform.
    """
    CITIZEN = "citizen"
    UNIVERSITY = "university"
    INDUSTRY = "industry"
    GOVERNMENT = "government"
    ADMIN = "admin"


class AccountStatus(str, Enum):
    """
    User Account Verification & Lifecycle Status.
    """
    ACTIVE = "ACTIVE"
    PENDING = "PENDING"
    SUSPENDED = "SUSPENDED"
    REJECTED = "REJECTED"


class UserDocument(BaseModel):
    """
    Complete MongoDB User Document Schema representation.
    """
    # Common Fields
    id: Optional[str] = Field(default=None, alias="_id")
    role: UserRole
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password_hash: str
    profile_image: Optional[str] = None

    # Location & Jurisdiction
    location: Optional[str] = None
    city: Optional[str] = None
    state: str = "Jharkhand"
    country: str = "India"

    # Status & Accreditation
    status: AccountStatus = AccountStatus.ACTIVE
    is_verified: bool = False
    verification_status: Optional[str] = None  # e.g. "Pending Verification", "Approved", "Rejected"
    rejection_reason: Optional[str] = None

    # Role-Specific Attributes
    # University specific:
    organization_name: Optional[str] = None
    official_email: Optional[EmailStr] = None
    contact_person: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    university_type: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    departments: Optional[List[str]] = Field(default_factory=list)
    courses: Optional[List[str]] = Field(default_factory=list)
    research_areas: Optional[List[str]] = Field(default_factory=list)
    research_domains: Optional[List[str]] = Field(default_factory=list)
    technical_expertise: Optional[List[str]] = Field(default_factory=list)
    engineering_domains: Optional[List[str]] = Field(default_factory=list)
    research_skills: Optional[List[str]] = Field(default_factory=list)
    technologies: Optional[List[str]] = Field(default_factory=list)
    specializations: Optional[List[str]] = Field(default_factory=list)
    laboratories: Optional[List[str]] = Field(default_factory=list)
    research_centers: Optional[List[str]] = Field(default_factory=list)
    infrastructure: Optional[List[str]] = Field(default_factory=list)
    equipment: Optional[List[str]] = Field(default_factory=list)
    industry_collaboration_areas: Optional[List[str]] = Field(default_factory=list)
    government_collaboration: Optional[List[str]] = Field(default_factory=list)
    student_innovation: Optional[str] = None
    research_support: Optional[str] = None
    csr_areas: Optional[List[str]] = Field(default_factory=list)
    expertise: Optional[List[str]] = Field(default_factory=list)
    domains: Optional[List[str]] = Field(default_factory=list)
    university_logo: Optional[str] = None

    # Industry specific:
    company_name: Optional[str] = None
    industry_type: Optional[str] = None
    support_available: Optional[List[str]] = Field(default_factory=list)
    company_logo: Optional[str] = None

    # Government specific:
    authorized_person: Optional[str] = None
    department_category: Optional[str] = None

    # Audit Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
