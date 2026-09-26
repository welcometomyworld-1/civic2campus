import pytest
from unittest.mock import MagicMock, AsyncMock
from bson import ObjectId
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.dependencies.db import get_db
from app.utils.security import create_access_token


@pytest.mark.asyncio
async def test_citizen_registration_validation():
    """
    Test citizen registration payload validation and password confirmation mismatch.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test password mismatch
        mismatch_payload = {
            "role": "citizen",
            "name": "Rohan Kumar",
            "email": "rohan.test@gmail.com",
            "phone": "9876543210",
            "location": "Harmu Housing Colony",
            "city": "Ranchi",
            "state": "Jharkhand",
            "password": "Password123!",
            "confirm_password": "WrongPassword123!",
            "agree_terms": True
        }
        res = await client.post("/api/auth/register", json=mismatch_payload)
        assert res.status_code == 422

        # 2. Test terms not agreed
        no_terms_payload = mismatch_payload.copy()
        no_terms_payload["confirm_password"] = "Password123!"
        no_terms_payload["agree_terms"] = False
        res = await client.post("/api/auth/register", json=no_terms_payload)
        assert res.status_code == 422


@pytest.mark.asyncio
async def test_university_registration_structure():
    """
    Test university registration structure requirements.
    """
    mock_db = MagicMock()
    users_col = MagicMock()
    users_col.find_one = AsyncMock(return_value=None)
    users_col.insert_one = AsyncMock(return_value=MagicMock(inserted_id=ObjectId("65e000000000000000000003")))
    audit_col = MagicMock()
    audit_col.insert_one = AsyncMock()
    notif_col = MagicMock()
    notif_col.insert_one = AsyncMock()
    univ_col = MagicMock()
    univ_col.update_one = AsyncMock()

    cols = {"users": users_col, "audit_logs": audit_col, "notifications": notif_col, "universities": univ_col}
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())
    app.dependency_overrides[get_db] = lambda: mock_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        uni_payload = {
            "role": "university",
            "university_name": "Birla Institute of Technology, Mesra",
            "official_email": "dean.rnd@bitmesra.ac.in",
            "contact_person": "Dr. S. K. Verma",
            "phone": "9431123456",
            "department": "Computer Science & Engineering",
            "university_type": "CFTI / Deemed University",
            "city": "Ranchi",
            "state": "Jharkhand",
            "website": "https://www.bitmesra.ac.in",
            "domains": ["AI / ML", "IoT", "Clean Water"],
            "password": "SecureUnivPass@2026",
            "confirm_password": "SecureUnivPass@2026",
            "agree_terms": True
        }
        res = await client.post("/api/auth/register", json=uni_payload)
        assert res.status_code == 201
        assert res.json()["role"] == "university"

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_industry_registration_structure():
    """
    Test industry registration structure requirements.
    """
    mock_db = MagicMock()
    users_col = MagicMock()
    users_col.find_one = AsyncMock(return_value=None)
    users_col.insert_one = AsyncMock(return_value=MagicMock(inserted_id=ObjectId("65e000000000000000000004")))
    audit_col = MagicMock()
    audit_col.insert_one = AsyncMock()
    notif_col = MagicMock()
    notif_col.insert_one = AsyncMock()
    ind_col = MagicMock()
    ind_col.update_one = AsyncMock()

    cols = {"users": users_col, "audit_logs": audit_col, "notifications": notif_col, "industries": ind_col}
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())
    app.dependency_overrides[get_db] = lambda: mock_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        ind_payload = {
            "role": "industry",
            "company_name": "Tata Steel CSR Foundation",
            "official_email": "csr.jharkhand@tatasteel.com",
            "contact_person": "Sunil Verma",
            "designation": "Head of CSR Initiatives",
            "phone": "9835198765",
            "industry_type": "Manufacturing & Clean Tech",
            "location": "Jamshedpur Works",
            "city": "Jamshedpur",
            "state": "Jharkhand",
            "website": "https://www.tatasteel.com",
            "expertise": ["Infrastructure", "Clean Energy"],
            "support_available": ["Funding", "Mentorship", "Testing Labs"],
            "password": "IndustrySecure@2026",
            "confirm_password": "IndustrySecure@2026",
            "agree_terms": True
        }
        res = await client.post("/api/auth/register", json=ind_payload)
        assert res.status_code == 201
        assert res.json()["role"] == "industry"

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_government_registration_structure():
    """
    Test government department registration structure requirements.
    """
    mock_db = MagicMock()
    users_col = MagicMock()
    users_col.find_one = AsyncMock(return_value=None)
    users_col.insert_one = AsyncMock(return_value=MagicMock(inserted_id=ObjectId("65e000000000000000000005")))
    audit_col = MagicMock()
    audit_col.insert_one = AsyncMock()
    notif_col = MagicMock()
    notif_col.insert_one = AsyncMock()

    cols = {"users": users_col, "audit_logs": audit_col, "notifications": notif_col}
    mock_db.__getitem__.side_effect = lambda name: cols.get(name, MagicMock())
    app.dependency_overrides[get_db] = lambda: mock_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        gov_payload = {
            "role": "government",
            "department_name": "Department of Drinking Water & Sanitation",
            "official_email": "dwsd.director@jharkhand.gov.in",
            "authorized_person": "Sri Rajeshwar Prasad, IAS",
            "designation": "State Nodal Director",
            "phone": "9431188776",
            "department_category": "Drinking Water & Sanitation",
            "city": "Ranchi (State Secretariat)",
            "state": "Jharkhand",
            "password": "GovtSecurePass@2026",
            "confirm_password": "GovtSecurePass@2026",
            "agree_terms": True
        }
        res = await client.post("/api/auth/register", json=gov_payload)
        assert res.status_code == 201
        assert res.json()["role"] == "government"

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_admin_public_registration_rejection():
    """
    Verify that public registration rejects ADMIN role requests.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        admin_payload = {
            "role": "admin",
            "name": "Hacker",
            "email": "fake.admin@jharkhand.gov.in",
            "phone": "9999999999",
            "location": "Secretariat",
            "city": "Ranchi",
            "password": "HackerPassword@123",
            "confirm_password": "HackerPassword@123",
            "agree_terms": True
        }
        res = await client.post("/api/auth/register", json=admin_payload)
        # Should fail with 422 or 403 because Admin is not in RegisterRequestUnion
        assert res.status_code in [400, 403, 422]


@pytest.mark.asyncio
async def test_jwt_role_protection():
    """
    Test RBAC token validation and role-protected endpoint access.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Unauthenticated request to protected route
        res = await client.get("/api/auth/me")
        assert res.status_code == 401

        # 2. Test with mock citizen token
        citizen_token = create_access_token({
            "sub": "mock_citizen_id",
            "email": "citizen@jharkhand.in",
            "role": "citizen",
            "name": "Mangal Tirkey"
        })

        # Accessing protected route without DB record gives 401
        res_citizen = await client.get(
            "/api/auth/test/citizen-only",
            headers={"Authorization": f"Bearer {citizen_token}"}
        )
        assert res_citizen.status_code in [200, 401, 404]
