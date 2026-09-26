import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    """
    Test root landing endpoint returns basic metadata.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["app"] == "Civic2Campus API"
        assert data["status"] == "online"
        assert "docs" in data


@pytest.mark.asyncio
async def test_app_health_endpoint():
    """
    Test /api/health endpoint returns healthy status.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
        assert "uptime_seconds" in data


@pytest.mark.asyncio
async def test_database_health_endpoint_structure():
    """
    Test /api/health/db returns structured database connectivity payload.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health/db")
        # May be 200 (if local mongo is running) or 503 (if mongo is not running locally)
        assert response.status_code in [200, 503]
        data = response.json()
        assert "connected" in data
        assert "database" in data
        assert "status" in data
