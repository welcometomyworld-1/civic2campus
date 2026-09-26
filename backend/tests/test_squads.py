import pytest
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database.mongodb import get_database


class MockCursor:
    def __init__(self, items):
        self.items = list(items)
        self.index = 0

    def sort(self, *args, **kwargs):
        return self

    def skip(self, *args, **kwargs):
        return self

    def limit(self, *args, **kwargs):
        return self

    def __aiter__(self):
        self.index = 0
        return self

    async def __anext__(self):
        if self.index < len(self.items):
            val = self.items[self.index]
            self.index += 1
            return val
        raise StopAsyncIteration


@pytest.mark.asyncio
async def test_squads_api_endpoints():
    mock_db = MagicMock()
    mock_squad = {
        "_id": "65e000000000000000000099",
        "squad_id": "SE-001",
        "name": "Smart Water Innovation Squad",
        "project_name": "AI Water Quality Monitoring",
        "problem_title": "Rural fluorosis in Toto Block",
        "status": "ACTIVE",
        "current_phase": "TESTING",
        "progress": 72,
        "members": [
            {
                "student_id": "STU-101",
                "name": "Rahul Kumar",
                "role": "TEAM_LEADER",
                "department": "CSE",
                "year": 4,
                "skills": ["IoT", "Python"]
            }
        ],
        "milestones": [],
        "tasks": [],
        "field_testing": [],
        "documents": [],
        "activity_timeline": []
    }

    async def mock_find_one(filter_dict=None, *args, **kwargs):
        if filter_dict and filter_dict.get("squad_id") == "SE-002":
            return None
        return dict(mock_squad)

    mock_db.student_squads.count_documents = AsyncMock(return_value=1)
    mock_db.student_squads.find = MagicMock(return_value=MockCursor([mock_squad]))
    mock_db.student_squads.find_one = AsyncMock(side_effect=mock_find_one)
    mock_db.student_squads.insert_one = AsyncMock(return_value=MagicMock(inserted_id="65e000000000000000000099"))
    mock_db.student_squads.update_one = AsyncMock(return_value=MagicMock(modified_count=1))
    mock_db.student_squads.delete_one = AsyncMock(return_value=MagicMock(deleted_count=1))
    
    mock_agg_cursor = MagicMock()
    mock_agg_cursor.to_list = AsyncMock(return_value=[{"total_students": 4, "total_field_trials": 2, "total_documents": 2}])
    mock_db.student_squads.aggregate = MagicMock(return_value=mock_agg_cursor)
    async def mock_get_database():
        return mock_db

    app.dependency_overrides[get_database] = mock_get_database

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. List Squads
        list_res = await client.get("/api/university/squads")
        assert list_res.status_code == 200
        assert list_res.json()["success"] is True

        # 2. Get Summary
        sum_res = await client.get("/api/university/squads/summary")
        assert sum_res.status_code == 200
        assert sum_res.json()["data"]["total_squads"] == 1

        # 3. Create Squad
        create_res = await client.post("/api/university/squads", json={
            "name": "New Innovation Squad",
            "project_name": "Solar Pump",
            "department": "Mechanical"
        })
        assert create_res.status_code == 201

        # 4. Get Detail
        get_res = await client.get("/api/university/squads/SE-001")
        assert get_res.status_code == 200
        assert get_res.json()["data"]["squad_id"] == "SE-001"

        # 5. Add Member
        add_mem_res = await client.post("/api/university/squads/SE-001/members", json={
            "student_id": "STU-102",
            "name": "Pooja Kumari",
            "role": "DEVELOPER",
            "department": "ECE",
            "year": 3
        })
        assert add_mem_res.status_code == 200

        # 6. Add Milestone
        m_res = await client.post("/api/university/squads/SE-001/milestones", json={
            "title": "Prototype Testing",
            "due_date": "2026-10-15"
        })
        assert m_res.status_code == 200

        # 7. Add Task
        t_res = await client.post("/api/university/squads/SE-001/tasks", json={
            "title": "Assemble PCB",
            "assigned_member": "Rahul Kumar",
            "priority": "HIGH"
        })
        assert t_res.status_code == 200

        # 8. Field Test
        ft_res = await client.post("/api/university/squads/SE-001/field-tests", json={
            "location": "Toto Block",
            "date": "2026-09-15",
            "objective": "Telemetry verification"
        })
        assert ft_res.status_code == 200

        # 9. Update Progress
        prog_res = await client.put("/api/university/squads/SE-001/progress", json={
            "current_phase": "FIELD_TRIAL",
            "progress": 80
        })
        assert prog_res.status_code == 200

        # 10. Delete Squad
        del_res = await client.delete("/api/university/squads/SE-001")
        assert del_res.status_code == 200

    app.dependency_overrides.clear()
