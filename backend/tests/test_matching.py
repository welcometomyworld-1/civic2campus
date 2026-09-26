import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.matching import TargetType, MatchStatus, ScoreBreakdown
from app.schemas.matching import (
    MatchResponse,
    ProblemRecommendationResponse,
    ExpressInterestRequest,
    RejectMatchRequest,
)
from app.services.matching_service import MatchingEngine, SEED_UNIVERSITIES, SEED_INDUSTRIES
from app.utils.security import create_access_token


def test_matching_engine_score_calculation():
    """
    Test MatchingEngine calculates a multi-factor composite score (0-100)
    with required breakdown and reasons.
    """
    problem = {
        "title": "Severe Fluoride and Iron Contamination in Handpump Groundwater",
        "description": "Over 400 villagers in Murhu Block have severe joint pain from high TDS water.",
        "category": "Water & Sanitation",
        "location": {
            "latitude": 23.0000,
            "longitude": 85.2000,
            "district": "Khunti",
            "city": "Khunti"
        }
    }

    ai_analysis = {
        "required_expertise": ["Environmental Engineering", "Clean Water Tech", "IoT & Sensor Telemetry"],
        "suggested_research_domains": ["Groundwater Contamination & Filtration", "Solar Powered Smart Water ATMs"],
        "rnd_brief": {
            "suggested_technology_areas": ["IoT & Sensor Telemetry", "Clean Water Tech"],
            "relevant_keywords": ["fluoride", "water", "filtration", "handpump", "telemetry"]
        }
    }

    # Test with BIT Mesra (strong water tech + IoT fit)
    bit_mesra = SEED_UNIVERSITIES[0]
    score, breakdown, reasons, skills, domains, keywords, distance_km = MatchingEngine.compute_match_score(
        problem=problem,
        ai_analysis=ai_analysis,
        organization=bit_mesra,
        target_type=TargetType.UNIVERSITY
    )

    assert 50.0 <= score <= 100.0
    assert breakdown.expertise_score > 0
    assert breakdown.domain_score > 0
    assert breakdown.technology_score > 0
    assert breakdown.total_score == score
    assert len(reasons) >= 1
    assert "Environmental Engineering" in skills or "Clean Water Tech" in skills or "IoT & Sensor Telemetry" in skills
    assert distance_km is not None
    assert distance_km > 0


def test_matching_engine_haversine_distance():
    """
    Test Haversine distance calculations between Ranchi and Jamshedpur (~110-130 km).
    """
    ranchi_lat, ranchi_lon = 23.3441, 85.3096
    jsr_lat, jsr_lon = 22.8046, 86.2029

    distance = MatchingEngine._calculate_haversine_distance(ranchi_lat, ranchi_lon, jsr_lat, jsr_lon)
    assert 100.0 <= distance <= 140.0


def test_matching_response_schema_compatibility():
    """
    Verify MatchResponse conforms to all required Step 5 fields including aliases.
    """
    breakdown = ScoreBreakdown(
        expertise_score=35.0,
        domain_score=18.0,
        technology_score=12.0,
        location_score=8.0,
        keyword_score=8.0,
        availability_score=5.0,
        total_score=86.0
    )

    match = MatchResponse(
        id="match_test_123",
        problem_id="6654a123bc456ef789012345",
        problem_title="Groundwater Contamination",
        problem_category="Water & Sanitation",
        target_type=TargetType.UNIVERSITY,
        target_id="univ_bit_mesra",
        target_name="Birla Institute of Technology, Mesra",
        target_email="innovator@bitmesra.ac.in",
        organization_id="univ_bit_mesra",
        organization_name="Birla Institute of Technology, Mesra",
        match_score=86.0,
        score_breakdown=breakdown,
        matching_reason="Strong faculty/squad expertise match in Environmental Engineering",
        reasons=["Strong faculty/squad expertise match in Environmental Engineering", "Nearby district proximity (45 km away)"],
        matched_expertise=["Environmental Engineering", "IoT & Sensor Telemetry"],
        matched_domains=["Groundwater Contamination & Filtration"],
        matched_keywords=["water", "filtration"],
        location_distance=45.2,
        location_distance_km=45.2,
        status=MatchStatus.PROPOSED,
        is_semantic=True,
        created_at="2026-09-17T02:00:00Z",
        updated_at="2026-09-17T02:00:00Z"
    )

    data = match.model_dump()
    assert data["organization_id"] == "univ_bit_mesra"
    assert data["organization_name"] == "Birla Institute of Technology, Mesra"
    assert data["match_score"] == 86.0
    assert data["location_distance"] == 45.2
    assert "Environmental Engineering" in data["matched_expertise"]


@pytest.mark.asyncio
async def test_recommendations_endpoints():
    """
    Test university and industry recommendations public / preview endpoints.
    """
    from app.dependencies.db import get_db
    from unittest.mock import AsyncMock, MagicMock

    class MockCursor:
        def __init__(self, items):
            self.items = items
            self.index = 0

        def sort(self, *args, **kwargs):
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

    mock_db = MagicMock()
    mock_db.__getitem__.return_value.find.return_value = MockCursor([])

    app.dependency_overrides[get_db] = lambda: mock_db
    transport = ASGITransport(app=app)
    try:
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # 1. University recommendations
            res_univ = await client.get("/api/universities/recommendations")
            assert res_univ.status_code == 200
            assert isinstance(res_univ.json(), list)

            # 2. Industry recommendations
            res_ind = await client.get("/api/industries/recommendations")
            assert res_ind.status_code == 200
            assert isinstance(res_ind.json(), list)
    finally:
        app.dependency_overrides.pop(get_db, None)


@pytest.mark.asyncio
async def test_matching_interest_and_reject_authorization():
    """
    Test match acceptance and decline require University / Industry authentication.
    """
    from datetime import datetime
    from app.dependencies.auth import get_current_user
    from app.models.user import UserRole, AccountStatus
    from app.schemas.user import UserProfileResponse

    # 1. Without token: 401 Unauthorized
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_no_auth = await client.post("/api/matches/test_match_id/interest", json={"note": "Eager to collaborate"})
        assert res_no_auth.status_code == 401

    # 2. Citizen user should be rejected with 403 Forbidden
    async def mock_citizen():
        return UserProfileResponse(
            id="mock_citizen_id",
            name="Citizen User",
            email="citizen@jharkhand.in",
            role=UserRole.CITIZEN,
            status=AccountStatus.ACTIVE,
            is_verified=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

    app.dependency_overrides[get_current_user] = mock_citizen
    try:
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res_forbidden = await client.post(
                "/api/matches/test_match_id/interest",
                json={"note": "Eager to collaborate"}
            )
            assert res_forbidden.status_code == 403
    finally:
        app.dependency_overrides.pop(get_current_user, None)


