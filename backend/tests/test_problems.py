import pytest
from datetime import datetime, timezone
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from bson import ObjectId

from app.main import app
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import UserRole, AccountStatus
from app.schemas.user import UserProfileResponse


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
def mock_citizen():
    now = datetime.now(timezone.utc)
    return UserProfileResponse(
        id="65e000000000000000000002",
        email="citizen@jharkhand.in",
        role=UserRole.CITIZEN,
        name="Mangal Tirkey",
        status=AccountStatus.ACTIVE,
        is_verified=True,
        created_at=now,
        updated_at=now
    )


@pytest.mark.asyncio
async def test_problem_create_schema_validation(mock_citizen):
    """
    Test problem creation validation requires title, description, category, and valid lat/lng.
    """
    mock_db = MagicMock()
    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: mock_citizen

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Invalid coordinate (latitude > 90)
        invalid_payload = {
            "title": "Severe Water Contamination in Murhu",
            "description": "Handpumps dispensing high fluoride water causing joint pain in 300+ villagers.",
            "category": "Water & Sanitation",
            "urgency": "HIGH",
            "location": {
                "address": "Murhu Panchayat Main Market",
                "city": "Khunti",
                "district": "Khunti",
                "state": "Jharkhand",
                "country": "India",
                "latitude": 120.5,  # Invalid latitude (> 90)
                "longitude": 85.28
            },
            "evidence": []
        }

        res = await client.post(
            "/api/problems",
            json=invalid_payload,
            headers={"Authorization": "Bearer fake_token"}
        )
        assert res.status_code == 422

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_problem_public_list_endpoints():
    """
    Test public discovery endpoints for problems.
    """
    now = datetime.now(timezone.utc)
    sample_problem = {
        "_id": ObjectId("65e100000000000000000001"),
        "title": "Water Contamination in Harmu",
        "description": "Fluoride pollution in village wells",
        "category": "Water & Sanitation",
        "sub_category": "Groundwater",
        "status": "SUBMITTED",
        "urgency": "HIGH",
        "priority_score": 85.0,
        "ai_analysis_status": "PENDING",
        "affected_people": "500+",
        "location": {
            "address": "Harmu Road",
            "city": "Ranchi",
            "district": "Ranchi",
            "state": "Jharkhand",
            "country": "India",
            "latitude": 23.3441,
            "longitude": 85.3096,
            "coordinates": [85.3096, 23.3441]
        },
        "reported_by": {
            "id": "65e000000000000000000002",
            "name": "Rohan Verma",
            "email": "rohan@civic2campus.org",
            "role": "citizen"
        },
        "evidence": [],
        "created_at": now,
        "updated_at": now
    }

    mock_db = MagicMock()
    prob_col = MagicMock()
    prob_col.count_documents = AsyncMock(return_value=1)
    prob_col.find.side_effect = lambda *args, **kwargs: MockCursor([sample_problem])
    prob_col.aggregate.return_value = MockCursor([sample_problem])

    cols = {"problems": prob_col}
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())
    app.dependency_overrides[get_db] = lambda: mock_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. List problems
        res = await client.get("/api/problems?page=1&limit=10")
        assert res.status_code == 200

        # 2. Nearby query parameter check
        res_nearby = await client.get("/api/problems/nearby?lat=23.3441&lng=85.3096&radius_km=25")
        assert res_nearby.status_code == 200

        # 3. High priority query
        res_high = await client.get("/api/problems/high-priority?limit=5")
        assert res_high.status_code == 200

        # 4. Category filter query
        res_cat = await client.get("/api/problems/category/Water%20%26%20Sanitation")
        assert res_cat.status_code == 200

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_evidence_upload_extension_validation(mock_citizen):
    """
    Test evidence upload blocks disallowed extensions (e.g. .exe).
    """
    mock_db = MagicMock()
    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: mock_citizen

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Attempt to upload malicious file
        files = {"file": ("malicious.exe", b"binary content", "application/x-msdownload")}
        res = await client.post(
            "/api/problems/upload-evidence",
            files=files,
            headers={"Authorization": "Bearer fake_token"}
        )
        assert res.status_code == 400
        assert "Unsupported file extension" in res.json()["detail"]

    app.dependency_overrides.clear()
