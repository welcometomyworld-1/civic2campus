import pytest
from datetime import datetime, timezone
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from bson import ObjectId

from app.main import app
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import UserRole, AccountStatus
from app.models.notification import NotificationType
from app.models.map_marker import MapMarkerType, MapMarker
from app.schemas.user import UserProfileResponse
from app.schemas.notification import NotificationResponse, NotificationListResponse
from app.schemas.admin import AdminUserStatusUpdateRequest, AdminOrganizationReviewRequest, AuditLogResponse
from app.schemas.search import SearchResultItem, GlobalSearchResponse
from app.schemas.map import MapResponse


class MockCursor:
    def __init__(self, items):
        self.items = list(items)
        self.index = 0

    def sort(self, *args, **kwargs):
        return MockCursor(self.items)

    def skip(self, *args, **kwargs):
        return MockCursor(self.items)

    def limit(self, *args, **kwargs):
        return MockCursor(self.items)

    def __aiter__(self):
        self.index = 0
        return self

    async def __anext__(self):
        if self.index < len(self.items):
            val = self.items[self.index]
            self.index += 1
            return val
        raise StopAsyncIteration


@pytest.fixture
def admin_user():
    now = datetime.now(timezone.utc)
    return UserProfileResponse(
        id="65e000000000000000000001",
        email="admin@civic2campus.org",
        role=UserRole.ADMIN,
        name="Super Admin",
        status=AccountStatus.ACTIVE,
        is_verified=True,
        created_at=now,
        updated_at=now
    )


@pytest.fixture
def citizen_user():
    now = datetime.now(timezone.utc)
    return UserProfileResponse(
        id="65e000000000000000000002",
        email="citizen@civic2campus.org",
        role=UserRole.CITIZEN,
        name="Rohan Verma",
        status=AccountStatus.ACTIVE,
        is_verified=True,
        created_at=now,
        updated_at=now
    )


# -----------------------------------------------------------------------------
# 1. TEST INNOVATION MAP APIS
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_map_endpoints():
    sample_problem = {
        "_id": ObjectId("65e100000000000000000001"),
        "title": "Groundwater Contamination",
        "description": "High fluoride in Harmu",
        "category": "Water & Sanitation",
        "status": "IN_PROGRESS",
        "location": {
            "latitude": 23.3441,
            "longitude": 85.3096,
            "city": "Ranchi",
            "district": "Ranchi"
        }
    }

    prob_col = MagicMock()
    prob_col.find.side_effect = lambda *args, **kwargs: MockCursor([sample_problem])
    univ_col = MagicMock()
    univ_col.find.side_effect = lambda *args, **kwargs: MockCursor([])
    ind_col = MagicMock()
    ind_col.find.side_effect = lambda *args, **kwargs: MockCursor([])
    sol_col = MagicMock()
    sol_col.find.side_effect = lambda *args, **kwargs: MockCursor([])

    cols = {
        "problems": prob_col,
        "universities": univ_col,
        "industries": ind_col,
        "solutions": sol_col,
        "users": MagicMock(),
    }
    mock_db = MagicMock()
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())

    app.dependency_overrides[get_db] = lambda: mock_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Problems map
        res_prob = await client.get("/api/map/problems")
        assert res_prob.status_code == 200
        data_prob = res_prob.json()
        assert len(data_prob) == 1
        assert data_prob[0]["type"] == "PROBLEM"
        assert data_prob[0]["latitude"] == 23.3441

        # 2. Universities map (fallback to seed data)
        res_univ = await client.get("/api/map/universities")
        assert res_univ.status_code == 200
        data_univ = res_univ.json()
        assert len(data_univ) > 0
        assert data_univ[0]["type"] == "UNIVERSITY"

        # 3. Industries map (fallback to seed data)
        res_ind = await client.get("/api/map/industries")
        assert res_ind.status_code == 200
        data_ind = res_ind.json()
        assert len(data_ind) > 0
        assert data_ind[0]["type"] == "INDUSTRY"

        # 4. Nearby radius search
        res_nearby = await client.get("/api/map/nearby?latitude=23.3441&longitude=85.3096&radius=50")
        assert res_nearby.status_code == 200
        data_nearby = res_nearby.json()
        assert "markers" in data_nearby
        assert data_nearby["total"] >= 1

    app.dependency_overrides.clear()


# -----------------------------------------------------------------------------
# 2. TEST NOTIFICATIONS APIS
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_notifications_lifecycle(citizen_user):
    sample_notif = {
        "_id": ObjectId("65e800000000000000000001"),
        "user_id": str(citizen_user.id),
        "type": "PROBLEM_SUBMITTED",
        "title": "Problem Submitted",
        "message": "Your problem is under review",
        "related_id": "prob_123",
        "related_type": "PROBLEM",
        "is_read": False,
        "created_at": datetime.now(timezone.utc)
    }

    notif_col = MagicMock()
    notif_col.count_documents = AsyncMock(side_effect=[1, 1, 1, 1, 1])
    notif_col.find.side_effect = lambda *args, **kwargs: MockCursor([sample_notif])
    notif_col.find_one = AsyncMock(return_value=sample_notif)
    notif_col.find_one_and_update = AsyncMock(return_value={**sample_notif, "is_read": True})
    notif_col.update_one = AsyncMock()
    notif_col.update_many = AsyncMock(return_value=MagicMock(modified_count=1))

    cols = {"notifications": notif_col}
    mock_db = MagicMock()
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())

    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: citizen_user

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. List notifications
        res = await client.get("/api/notifications")
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 1
        assert data["unread_count"] == 1
        assert len(data["notifications"]) == 1

        # 2. Get unread shortcut
        res_unread = await client.get("/api/notifications/unread")
        assert res_unread.status_code == 200

        # 3. Mark single as read
        res_read = await client.put("/api/notifications/65e800000000000000000001/read")
        assert res_read.status_code == 200

        # 4. Mark all as read
        res_all = await client.put("/api/notifications/read-all")
        assert res_all.status_code == 200
        assert res_all.json()["success"] is True

    app.dependency_overrides.clear()


# -----------------------------------------------------------------------------
# 3. TEST ADMIN MANAGEMENT & RBAC SECURITY
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_admin_endpoints(admin_user, citizen_user):
    users_col = MagicMock()
    users_col.count_documents = AsyncMock(return_value=10)
    problems_col = MagicMock()
    problems_col.count_documents = AsyncMock(return_value=5)
    collab_col = MagicMock()
    collab_col.count_documents = AsyncMock(return_value=3)
    projects_col = MagicMock()
    projects_col.count_documents = AsyncMock(return_value=2)
    solutions_col = MagicMock()
    solutions_col.count_documents = AsyncMock(return_value=1)
    univ_col = MagicMock()
    univ_col.count_documents = AsyncMock(return_value=0)
    univ_col.update_many = AsyncMock()
    ind_col = MagicMock()
    ind_col.count_documents = AsyncMock(return_value=0)
    ind_col.update_many = AsyncMock()
    audit_col = MagicMock()
    audit_col.insert_one = AsyncMock()
    audit_col.find.side_effect = lambda *args, **kwargs: MockCursor([])
    notif_col = MagicMock()
    notif_col.insert_one = AsyncMock()

    sample_user = {
        "_id": ObjectId("65e000000000000000000002"),
        "email": "citizen@civic2campus.org",
        "role": "CITIZEN",
        "status": "ACTIVE",
        "name": "Rohan Verma",
        "created_at": datetime.now(timezone.utc)
    }
    users_col.find.side_effect = lambda *args, **kwargs: MockCursor([sample_user])
    users_col.find_one = AsyncMock(return_value=sample_user)
    users_col.update_one = AsyncMock()

    cols = {
        "users": users_col,
        "problems": problems_col,
        "collaborations": collab_col,
        "projects": projects_col,
        "solutions": solutions_col,
        "universities": univ_col,
        "industries": ind_col,
        "audit_logs": audit_col,
        "notifications": notif_col,
    }
    mock_db = MagicMock()
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())

    # 1. Test Admin Access (200 OK)
    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: admin_user

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Admin stats
        res_stats = await client.get("/api/admin/stats")
        assert res_stats.status_code == 200
        assert "users" in res_stats.json()
        assert "problems" in res_stats.json()

        # Admin user list
        res_users = await client.get("/api/admin/users")
        assert res_users.status_code == 200
        assert res_users.json()["total"] == 10

        # Admin update status
        res_status = await client.put(
            "/api/admin/users/65e000000000000000000002/status",
            json={"status": "ACTIVE", "reason": "Verified citizen identity"}
        )
        assert res_status.status_code == 200
        assert res_status.json()["new_status"] == "ACTIVE"

        # Admin organization approve
        res_app = await client.put(
            "/api/admin/organizations/65e000000000000000000003/approve",
            json={"action": "APPROVE", "verification_notes": "Valid accreditation"}
        )
        assert res_app.status_code == 200
        assert res_app.json()["status"] == "APPROVED"

    # 2. Test RBAC Security (Citizen user blocked from admin -> 403 Forbidden)
    app.dependency_overrides[get_current_user] = lambda: citizen_user
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_forbidden = await client.get("/api/admin/stats")
        assert res_forbidden.status_code == 403

    app.dependency_overrides.clear()


# -----------------------------------------------------------------------------
# 4. TEST GLOBAL SEARCH API
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_global_search():
    sample_problem = {
        "_id": ObjectId("65e100000000000000000001"),
        "title": "Water Contamination in Harmu",
        "description": "Fluoride pollution in village wells",
        "category": "Water & Sanitation",
        "status": "IN_PROGRESS",
        "location": {"city": "Ranchi", "district": "Ranchi"}
    }

    prob_col = MagicMock()
    prob_col.find.side_effect = lambda *args, **kwargs: MockCursor([sample_problem])
    univ_col = MagicMock()
    univ_col.find.side_effect = lambda *args, **kwargs: MockCursor([])
    ind_col = MagicMock()
    ind_col.find.side_effect = lambda *args, **kwargs: MockCursor([])
    sol_col = MagicMock()
    sol_col.find.side_effect = lambda *args, **kwargs: MockCursor([])

    cols = {
        "problems": prob_col,
        "universities": univ_col,
        "industries": ind_col,
        "solutions": sol_col
    }
    mock_db = MagicMock()
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())

    app.dependency_overrides[get_db] = lambda: mock_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/search?q=water")
        assert res.status_code == 200
        data = res.json()
        assert data["query"] == "water"
        assert data["total"] == 1
        assert data["results"][0]["type"] == "problem"
        assert "Water" in data["results"][0]["title"]

    app.dependency_overrides.clear()
