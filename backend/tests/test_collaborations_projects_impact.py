import pytest
from datetime import datetime
from unittest.mock import MagicMock
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.user import UserRole, AccountStatus
from app.models.collaboration import CollaborationStatus, CollaborationMember
from app.models.project import ProjectStatus, MilestoneStatus, Milestone
from app.models.solution import SolutionStatus
from app.schemas.user import UserProfileResponse
from app.schemas.collaboration import CollaborationCreateRequest, CollaborationResponse
from app.schemas.project import ProjectCreateRequest, ProjectResponse, MilestoneCreateRequest
from app.schemas.solution import SolutionCreateRequest, SolutionResponse
from app.schemas.impact import ImpactCreateRequest, ImpactResponse
from app.schemas.dashboard import (
    CitizenDashboardResponse,
    UniversityDashboardResponse,
    IndustryDashboardResponse,
    GovernmentDashboardResponse,
    AdminDashboardResponse,
)


class MockCursor:
    def __init__(self, items):
        self.items = items
        self.index = 0

    def sort(self, *args, **kwargs):
        return self

    def skip(self, *args, **kwargs):
        return self

    def limit(self, *args, **kwargs):
        return self

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.index < len(self.items):
            val = self.items[self.index]
            self.index += 1
            return val
        raise StopAsyncIteration


def test_collaboration_and_project_schemas():
    """
    Test Pydantic schemas for Collaboration, Project, Solution, and Impact.
    """
    collab = CollaborationResponse(
        id="collab_123",
        problem_id="prob_456",
        problem_title="Water Contamination in Khunti",
        problem_category="Water & Sanitation",
        university_id="univ_bit_mesra",
        university_name="Birla Institute of Technology, Mesra",
        industry_id="ind_tata_csr",
        industry_name="Tata Steel CSR Foundation",
        title="Decentralized Fluoride Filtration Squad",
        description="Deploying IoT telemetry and adsorption filters.",
        members=[
            CollaborationMember(name="Dr. Rajiv Ranjan", role="Faculty Mentor"),
            CollaborationMember(name="Sunil Verma", role="CSR Sponsor Lead")
        ],
        status=CollaborationStatus.ACTIVE,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    assert collab.status == CollaborationStatus.ACTIVE
    assert len(collab.members) == 2

    project = ProjectResponse(
        id="proj_123",
        name="Smart Solar Water ATM Prototype",
        problem_id="prob_456",
        team_members=["Innovator Student 1", "Innovator Student 2"],
        mentor="Dr. Rajiv Ranjan",
        description="Hardware build with LoRaWAN telemetry",
        milestones=[
            Milestone(id="ms_1", title="Circuit Design", status=MilestoneStatus.COMPLETED),
            Milestone(id="ms_2", title="Field Enclosure", status=MilestoneStatus.PENDING)
        ],
        progress=50.0,
        status=ProjectStatus.ACTIVE,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    assert project.progress == 50.0
    assert len(project.milestones) == 2

    solution = SolutionResponse(
        id="sol_123",
        problem_id="prob_456",
        project_id="proj_123",
        title="Murhu Solar Water ATM v1.0",
        description="Solar-powered multi-stage water filtration unit dispensing safe water.",
        solution_type="Hardware + IoT",
        technology=["ESP32", "LoRaWAN", "Activated Alumina"],
        status=SolutionStatus.DEPLOYED,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    assert solution.status == SolutionStatus.DEPLOYED

    impact = ImpactResponse(
        id="imp_123",
        solution_id="sol_123",
        people_benefited=450,
        area_covered="Murhu Block (3 Panchayats)",
        problem_resolved_percentage=100.0,
        cost_saved="INR 4.5 Lakhs vs contractor tender",
        impact_description="Zero reported fluorosis symptoms in 6 months.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    assert impact.people_benefited == 450


@pytest.mark.asyncio
async def test_dashboard_endpoints():
    """
    Test live KPI dashboard endpoints for all 5 roles.
    """
    from unittest.mock import AsyncMock

    mock_db = MagicMock()
    mock_db.__getitem__.return_value.count_documents = AsyncMock(return_value=5)
    mock_db.__getitem__.return_value.aggregate.return_value = MockCursor([
        {"_id": "ACTIVE", "count": 3},
        {"_id": "Water & Sanitation", "count": 4},
        {"_id": "total", "total": 1200, "total_benefited": 1200}
    ])
    mock_db.__getitem__.return_value.find.return_value = MockCursor([])

    app.dependency_overrides[get_db] = lambda: mock_db

    async def mock_admin_user():
        return UserProfileResponse(
            id="mock_admin_id",
            name="State Admin",
            email="admin@civic2campus.jharkhand.gov.in",
            role=UserRole.ADMIN,
            status=AccountStatus.ACTIVE,
            is_verified=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

    app.dependency_overrides[get_current_user] = mock_admin_user
    app.dependency_overrides[require_admin] = mock_admin_user

    transport = ASGITransport(app=app)
    try:
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # 1. Citizen Dashboard
            res_cit = await client.get("/api/dashboard/citizen")
            assert res_cit.status_code == 200
            assert "problems_reported" in res_cit.json()

            # 2. University Dashboard
            res_uni = await client.get("/api/dashboard/university")
            assert res_uni.status_code == 200
            assert "matched_problems" in res_uni.json()

            # 3. Industry Dashboard
            res_ind = await client.get("/api/dashboard/industry")
            assert res_ind.status_code == 200
            assert "matched_opportunities" in res_ind.json()

            # 4. Government Dashboard
            res_gov = await client.get("/api/dashboard/government")
            assert res_gov.status_code == 200
            assert "total_problems" in res_gov.json()

            # 5. Admin Dashboard
            res_adm = await client.get("/api/dashboard/admin")
            assert res_adm.status_code == 200
            assert "total_citizens" in res_adm.json()
    finally:
        app.dependency_overrides.pop(get_db, None)
        app.dependency_overrides.pop(get_current_user, None)
        app.dependency_overrides.pop(require_admin, None)


@pytest.mark.asyncio
async def test_collaborations_projects_solutions_list_endpoints():
    """
    Test directory list endpoints for collaborations, projects, and solutions.
    """
    from unittest.mock import AsyncMock

    mock_db = MagicMock()
    mock_db.__getitem__.return_value.count_documents = AsyncMock(return_value=0)
    mock_db.__getitem__.return_value.find.return_value = MockCursor([])

    app.dependency_overrides[get_db] = lambda: mock_db
    transport = ASGITransport(app=app)
    try:
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res_col = await client.get("/api/collaborations?page=1&limit=10")
            assert res_col.status_code == 200
            assert isinstance(res_col.json().get("collaborations"), list)

            res_prj = await client.get("/api/projects?page=1&limit=10")
            assert res_prj.status_code == 200
            assert isinstance(res_prj.json().get("projects"), list)

            res_sol = await client.get("/api/solutions?page=1&limit=10")
            assert res_sol.status_code == 200
            assert isinstance(res_sol.json().get("solutions"), list)
    finally:
        app.dependency_overrides.pop(get_db, None)

