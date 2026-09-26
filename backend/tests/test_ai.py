import pytest
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.dependencies.db import get_db
from app.services.ai_service import DeterministicFallbackProvider, DuplicateDetector


@pytest.mark.asyncio
async def test_deterministic_fallback_water_rnd_brief():
    """
    Verify that the deterministic fallback provider generates a complete 10-point R&D brief.
    """
    provider = DeterministicFallbackProvider()
    problem_mock = {
        "title": "Arsenic in Groundwater Handpumps",
        "description": "Severe fluoride and arsenic levels detected in 6 borewells in Murhu village.",
        "category": "Water & Sanitation",
        "urgency": "HIGH",
        "affected_people": "450 villagers",
        "location": {
            "address": "Murhu Panchayat",
            "city": "Khunti",
            "district": "Khunti",
            "state": "Jharkhand"
        }
    }

    analysis = await provider.generate_problem_analysis(problem_mock, [])

    # Check top level classification
    assert analysis["category"] == "Water & Sanitation"
    assert analysis["priority"] == "HIGH"
    assert analysis["is_fallback"] is True
    assert len(analysis["required_expertise"]) >= 2
    assert len(analysis["suggested_research_domains"]) >= 2

    # Check 10-point R&D Brief
    brief = analysis["rnd_brief"]
    assert "problem_statement" in brief
    assert "current_situation" in brief
    assert len(brief["key_challenges"]) >= 2
    assert len(brief["required_expertise"]) >= 2
    assert len(brief["suggested_research_area"]) >= 2
    assert len(brief["suggested_technology_areas"]) >= 2
    assert len(brief["potential_solution_direction"]) >= 2
    assert len(brief["stakeholders"]) >= 2
    assert "expected_impact" in brief
    assert len(brief["relevant_keywords"]) >= 3


@pytest.mark.asyncio
async def test_duplicate_detector_tokenization():
    """
    Verify tokenizer cleans stopwords and extracts meaningful semantic tokens.
    """
    detector = DuplicateDetector()
    tokens = detector._tokenize("Severe Water Contamination in Murhu Village Khunti Area")
    assert "water" in tokens
    assert "contamination" in tokens
    assert "murhu" in tokens
    assert "khunti" in tokens
    assert "the" not in tokens
    assert "in" not in tokens


@pytest.mark.asyncio
async def test_ai_endpoints_response_schemas():
    """
    Test endpoint routing and parameter validation for AI routes.
    """
    mock_db = MagicMock()
    mock_col = MagicMock()
    mock_col.find_one = AsyncMock(return_value=None)
    mock_db.__getitem__.return_value = mock_col
    app.dependency_overrides[get_db] = lambda: mock_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Invalid ObjectId format
        res = await client.get("/api/ai/analysis/invalid_id_123")
        assert res.status_code == 400

        res_rnd = await client.get("/api/ai/analysis/invalid_id_123/rnd-brief")
        assert res_rnd.status_code == 400

        res_dup = await client.get("/api/ai/duplicates/invalid_id_123")
        assert res_dup.status_code == 400

    app.dependency_overrides.clear()
