import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_university_hubs_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Industry Partners
        res = await client.get("/api/university/industry-partners")
        assert res.status_code == 200
        data = res.json()
        assert "items" in data
        assert isinstance(data["items"], list)

        # 2. Active Collaborations
        res = await client.get("/api/university/collaborations")
        assert res.status_code == 200
        collabs = res.json()
        assert "items" in collabs

        # 3. Solutions
        res = await client.get("/api/university/solutions")
        assert res.status_code == 200
        solutions = res.json()
        assert "items" in solutions

        # 4. Impact Summary
        res = await client.get("/api/university/impact/summary")
        assert res.status_code == 200
        impact = res.json()
        assert "problems_addressed" in impact
        assert "people_benefited" in impact

        # 5. University Profile
        res = await client.get("/api/university/profile")
        assert res.status_code == 200
        profile = res.json()
        assert "name" in profile

        # 6. Notifications
        res = await client.get("/api/university/notifications")
        assert res.status_code == 200
        notifs = res.json()
        assert "items" in notifs
