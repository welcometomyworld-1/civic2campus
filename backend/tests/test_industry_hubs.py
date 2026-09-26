import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_industry_hubs_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. CSR FUNDING ENDPOINTS
        res = await ac.get("/api/industry/csr/summary")
        assert res.status_code == 200
        csr_summary = res.json()
        assert "total_csr_commitment" in csr_summary
        assert "amount_released" in csr_summary
        assert "projects_funded" in csr_summary

        res = await ac.get("/api/industry/csr")
        assert res.status_code == 200
        csr_list = res.json()
        assert "items" in csr_list
        assert "total" in csr_list
        assert len(csr_list["items"]) > 0
        first_csr_id = csr_list["items"][0]["id"]

        res = await ac.get(f"/api/industry/csr/{first_csr_id}")
        assert res.status_code == 200
        assert res.json()["id"] == first_csr_id

        # Create new CSR funding
        new_csr_payload = {
            "project_name": "AI Clean Coal Mist Node",
            "problem_name": "Coal Dust in Dhanbad",
            "amount": 450000.0,
            "support_type": "CSR",
            "purpose": "Dust suppression cannons"
        }
        res = await ac.post("/api/industry/csr", json=new_csr_payload)
        assert res.status_code == 201
        created_csr = res.json()
        assert created_csr["amount"] == 450000.0
        created_csr_id = created_csr["id"]

        # Update status
        res = await ac.put(f"/api/industry/csr/{created_csr_id}/status", json={"status": "RELEASED", "note": "Tranche 1 released"})
        assert res.status_code == 200
        assert res.json()["status"] == "RELEASED"

        # 2. TECH SUPPORT ENDPOINTS
        res = await ac.get("/api/industry/tech-support")
        assert res.status_code == 200
        tech_list = res.json()
        assert "items" in tech_list
        assert len(tech_list["items"]) > 0
        first_tech_id = tech_list["items"][0]["id"]

        res = await ac.get(f"/api/industry/tech-support/{first_tech_id}")
        assert res.status_code == 200

        # Create new Tech Support
        new_tech_payload = {
            "project_name": "Smart Water Sensor Lab",
            "university_name": "BIT Mesra",
            "support_type": "IoT",
            "technology": ["ESP32", "LoRaWAN"],
            "assigned_expert": "Dr. Vivek"
        }
        res = await ac.post("/api/industry/tech-support", json=new_tech_payload)
        assert res.status_code == 201
        created_tech_id = res.json()["id"]

        # Add task to tech support
        res = await ac.post(f"/api/industry/tech-support/{created_tech_id}/tasks", json={
            "title": "Evaluate sensor precision",
            "assigned_to": "Dr. Vivek"
        })
        assert res.status_code == 200
        assert len(res.json()["tasks"]) > 0

        # 3. SOLUTIONS ENDPOINTS
        res = await ac.get("/api/industry/solutions")
        assert res.status_code == 200
        sol_list = res.json()
        assert "items" in sol_list

        # Register solution
        new_sol_payload = {
            "solution_name": "Autonomous Coal Misting Node",
            "problem_name": "Air pollution in mining belt",
            "technology": ["IoT", "LoRa"],
            "status": "PROTOTYPE"
        }
        res = await ac.post("/api/industry/solutions", json=new_sol_payload)
        assert res.status_code == 201
        created_sol_id = res.json()["id"]

        # Add testing run
        res = await ac.post(f"/api/industry/solutions/{created_sol_id}/testing", json={
            "tested_by": "Rajat M.",
            "parameters": "Water pressure 150 bar",
            "result": "PASS",
            "notes": "Optimal droplet size"
        })
        assert res.status_code == 200

        # Add deployment
        res = await ac.post(f"/api/industry/solutions/{created_sol_id}/deployment", json={
            "deployment_location": "Dhanbad Katras Yard",
            "deployment_date": "2026-09-17",
            "people_benefited": 2500,
            "outcomes": "80% reduction in dust"
        })
        assert res.status_code == 200
        assert res.json()["status"] == "DEPLOYED"

        # 4. IMPACT ENDPOINTS
        res = await ac.get("/api/industry/impact/summary")
        assert res.status_code == 200
        imp = res.json()
        assert "projects_supported" in imp
        assert "people_benefited" in imp
        assert "csr_funding_total" in imp

        res = await ac.get("/api/industry/impact/timeline")
        assert res.status_code == 200
        tl = res.json()
        assert "people_benefited_trend" in tl
        assert "csr_by_project" in tl

        # 5. PROFILE ENDPOINTS
        res = await ac.get("/api/industry/profile")
        assert res.status_code == 200
        prof = res.json()
        assert "company_name" in prof
        assert "official_email" in prof

        # Update profile
        res = await ac.put("/api/industry/profile", json={
            "company_name": "Tata Steel CSR Foundation Updated",
            "city": "Jamshedpur"
        })
        assert res.status_code == 200
        assert res.json()["company_name"] == "Tata Steel CSR Foundation Updated"
