from app.schemas.health import AppHealthResponse, DatabaseHealthResponse
from app.schemas.user import UserProfileResponse, UserUpdateRequest
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
from app.schemas.problem import (
    LocationInput,
    EvidenceInput,
    ProblemCreateRequest,
    ProblemUpdateRequest,
    ProblemResponse,
    ProblemListResponse,
    EvidenceUploadResponse,
)
from app.schemas.ai_analysis import (
    AIAnalysisResponse,
    RndBriefResponse,
    DuplicateDetectionResponse,
    TriggerAnalysisResponse,
)
from app.schemas.matching import (
    MatchResponse,
    ProblemRecommendationResponse,
    ExpressInterestRequest,
    RejectMatchRequest,
)
from app.schemas.collaboration import (
    CollaborationCreateRequest,
    CollaborationUpdateRequest,
    CollaborationApproveRequest,
    CollaborationResponse,
    CollaborationListResponse,
)
from app.schemas.project import (
    MilestoneCreateRequest,
    MilestoneUpdateRequest,
    ProjectCreateRequest,
    ProjectUpdateRequest,
    ProjectResponse,
    ProjectListResponse,
)
from app.schemas.solution import (
    SolutionCreateRequest,
    SolutionUpdateRequest,
    SolutionResponse,
    SolutionListResponse,
)
from app.schemas.impact import (
    ImpactCreateRequest,
    ImpactResponse,
)
from app.schemas.dashboard import (
    CitizenDashboardResponse,
    UniversityDashboardResponse,
    IndustryDashboardResponse,
    GovernmentDashboardResponse,
    AdminDashboardResponse,
)
from app.schemas.notification import (
    NotificationCreateRequest,
    NotificationResponse,
    NotificationListResponse,
)
from app.schemas.map import (
    MapResponse,
)
from app.schemas.admin import (
    AdminUserStatusUpdateRequest,
    AdminOrganizationReviewRequest,
    AuditLogResponse,
    AuditLogListResponse,
)
from app.schemas.search import (
    SearchResultItem,
    GlobalSearchResponse,
)

__all__ = [
    "AppHealthResponse",
    "DatabaseHealthResponse",
    "UserProfileResponse",
    "UserUpdateRequest",
    "LoginRequest",
    "TokenResponse",
    "CitizenRegisterRequest",
    "UniversityRegisterRequest",
    "IndustryRegisterRequest",
    "GovernmentRegisterRequest",
    "RegisterRequestUnion",
    "RefreshTokenRequest",
    "ForgotPasswordRequest",
    "ResetPasswordRequest",
    "AdminApprovalRequest",
    "AuthMessageResponse",
    "LocationInput",
    "EvidenceInput",
    "ProblemCreateRequest",
    "ProblemUpdateRequest",
    "ProblemResponse",
    "ProblemListResponse",
    "EvidenceUploadResponse",
    "AIAnalysisResponse",
    "RndBriefResponse",
    "DuplicateDetectionResponse",
    "TriggerAnalysisResponse",
    "MatchResponse",
    "ProblemRecommendationResponse",
    "ExpressInterestRequest",
    "RejectMatchRequest",
    "CollaborationCreateRequest",
    "CollaborationUpdateRequest",
    "CollaborationApproveRequest",
    "CollaborationResponse",
    "CollaborationListResponse",
    "MilestoneCreateRequest",
    "MilestoneUpdateRequest",
    "ProjectCreateRequest",
    "ProjectUpdateRequest",
    "ProjectResponse",
    "ProjectListResponse",
    "SolutionCreateRequest",
    "SolutionUpdateRequest",
    "SolutionResponse",
    "SolutionListResponse",
    "ImpactCreateRequest",
    "ImpactResponse",
    "CitizenDashboardResponse",
    "UniversityDashboardResponse",
    "IndustryDashboardResponse",
    "GovernmentDashboardResponse",
    "AdminDashboardResponse",
    "NotificationCreateRequest",
    "NotificationResponse",
    "NotificationListResponse",
    "MapResponse",
    "AdminUserStatusUpdateRequest",
    "AdminOrganizationReviewRequest",
    "AuditLogResponse",
    "AuditLogListResponse",
    "SearchResultItem",
    "GlobalSearchResponse",
]

