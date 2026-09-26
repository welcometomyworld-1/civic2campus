"""
=============================================================================
Civic2Campus — Master Database Seed Script (STEP 7 Demo Data)
=============================================================================
Populates MongoDB with realistic end-to-end data across:
- 5 User Roles (Citizen, University, Industry, Government, Admin)
- Real Geotagged Jharkhand Problems (Water, Energy, Waste, Infra)
- AI Problem Classifications & R&D Briefs
- Smart University & Industry Capability Matches
- Multi-Stakeholder Collaboration Squads
- R&D Engineering Projects with Milestones
- Deployed IoT / Hardware Solutions
- Real-world Impact Metrics & Beneficiaries
- Notifications & System Audit Logs
=============================================================================
Usage:
    cd backend
    python scripts/seed.py
=============================================================================
"""

import sys
import os
import asyncio
from datetime import datetime, timedelta, timezone
from bson import ObjectId

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import get_settings
from app.utils.security import hash_password
from app.models.user import UserRole, AccountStatus
from app.models.notification import NotificationType
from app.models.map_marker import MapMarkerType


async def seed_database():
    settings = get_settings()
    print("=" * 70)
    print(f"Connecting to MongoDB: {settings.MONGODB_URI}")
    print(f"Target Database: {settings.DB_NAME}")
    print("=" * 70)

    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DB_NAME]
    now = datetime.now(timezone.utc)

    # -------------------------------------------------------------------------
    # 1. SEED USERS (5 Core Personas)
    # -------------------------------------------------------------------------
    print("\n[1/8] Seeding Demo User Accounts...")
    users_col = db["users"]

    demo_users = [
        {
            "_id": ObjectId("65e000000000000000000001"),
            "name": "Super Admin",
            "email": "admin@civic2campus.org",
            "role": UserRole.ADMIN.value,
            "password_hash": hash_password("AdminSecret2026!"),
            "status": AccountStatus.ACTIVE.value,
            "is_verified": True,
            "phone": "+91-9876543210",
            "organization_name": "Civic2Campus Foundation",
            "created_at": now - timedelta(days=60),
            "updated_at": now
        },
        {
            "_id": ObjectId("65e000000000000000000002"),
            "name": "Rohan Verma",
            "email": "citizen@civic2campus.org",
            "role": UserRole.CITIZEN.value,
            "password_hash": hash_password("Citizen123!"),
            "status": AccountStatus.ACTIVE.value,
            "is_verified": True,
            "phone": "+91-9123456780",
            "district": "Ranchi",
            "city": "Ranchi",
            "state": "Jharkhand",
            "location": "Harmu Colony, Ranchi, Jharkhand",
            "created_at": now - timedelta(days=45),
            "updated_at": now
        },
        {
            "_id": ObjectId("65e000000000000000000003"),
            "name": "Prof. Arvind Sharma (Dean R&D)",
            "email": "univ@bitmesra.ac.in",
            "official_email": "univ@bitmesra.ac.in",
            "role": UserRole.UNIVERSITY.value,
            "password_hash": hash_password("Univ123!"),
            "status": AccountStatus.ACTIVE.value,
            "is_verified": True,
            "organization_name": "Birla Institute of Technology (BIT) Mesra",
            "institution_type": "Autonomous University",
            "website": "https://www.bitmesra.ac.in",
            "departments": ["Civil & Environmental Engineering", "Computer Science", "IoT & Embedded Systems"],
            "expertise": ["Water Filtration", "IoT Sensors", "Structural Health Monitoring", "Solar Microgrids"],
            "location": "Mesra, Ranchi, Jharkhand",
            "city": "Ranchi",
            "state": "Jharkhand",
            "created_at": now - timedelta(days=40),
            "updated_at": now
        },
        {
            "_id": ObjectId("65e000000000000000000004"),
            "name": "Priya Sen (Head of CSR & Innovation)",
            "email": "csr@tatasteel.com",
            "official_email": "csr@tatasteel.com",
            "role": UserRole.INDUSTRY.value,
            "password_hash": hash_password("Industry123!"),
            "status": AccountStatus.ACTIVE.value,
            "is_verified": True,
            "company_name": "Tata Steel CSR & Sustainability Wing",
            "organization_name": "Tata Steel CSR & Sustainability Wing",
            "industry_type": "Manufacturing & Mining",
            "website": "https://www.tatasteel.com",
            "expertise": ["Industrial Automation", "Water Treatment", "Renewable Energy CSR", "Hardware Fabrication"],
            "support_available": ["CSR Grant Funding", "Prototyping Labs", "Pilot Deployment Sites", "Expert Mentorship"],
            "location": "Jamshedpur, East Singhbhum, Jharkhand",
            "city": "Jamshedpur",
            "state": "Jharkhand",
            "created_at": now - timedelta(days=35),
            "updated_at": now
        },
        {
            "_id": ObjectId("65e000000000000000000005"),
            "name": "Jharkhand Urban Development & Municipal Corp",
            "email": "jharkhand.urban@gov.in",
            "official_email": "jharkhand.urban@gov.in",
            "role": UserRole.GOVERNMENT.value,
            "password_hash": hash_password("Gov123!"),
            "status": AccountStatus.ACTIVE.value,
            "is_verified": True,
            "department_name": "Jharkhand Urban Development Authority (JUDA)",
            "organization_name": "Jharkhand Urban Development Authority (JUDA)",
            "department_category": "Municipal Infrastructure & Sanitation",
            "authorized_person": "Dr. S. K. Murmu (Joint Secretary)",
            "location": "Dhurwa, Ranchi, Jharkhand",
            "city": "Ranchi",
            "state": "Jharkhand",
            "created_at": now - timedelta(days=30),
            "updated_at": now
        }
    ]

    for u in demo_users:
        await users_col.update_one({"email": u["email"]}, {"$set": u}, upsert=True)
    print(f"  [OK] {len(demo_users)} Demo Users registered/updated.")

    # -------------------------------------------------------------------------
    # 2. SEED PROBLEMS (Real Jharkhand Locations)
    # -------------------------------------------------------------------------
    print("\n[2/8] Seeding Realistic Jharkhand Civic Problems...")
    problems_col = db["problems"]

    sample_problems = [
        {
            "_id": ObjectId("65e100000000000000000001"),
            "title": "Severe Arsenic and Fluoride Groundwater Contamination",
            "description": "Over 2,500 villagers in Harmu and Namkum suburban pockets rely on borewells that exhibit high fluoride and heavy metal levels, causing dental fluorosis and digestive ailments in school children.",
            "category": "Water & Sanitation",
            "sub_category": "Water Quality & Purification",
            "urgency": "HIGH",
            "status": "IN_PROGRESS",
            "ai_analysis_status": "COMPLETED",
            "affected_people": 2500,
            "tags": ["Groundwater", "Fluoride", "Water Purification", "Public Health"],
            "location": {
                "latitude": 23.3441,
                "longitude": 85.3096,
                "address": "Harmu Road, Namkum Block",
                "city": "Ranchi",
                "district": "Ranchi",
                "state": "Jharkhand",
                "pincode": "834002",
                "coordinates": [85.3096, 23.3441]
            },
            "reporter_id": "65e000000000000000000002",
            "reporter_name": "Rohan Verma",
            "created_at": now - timedelta(days=25),
            "updated_at": now - timedelta(days=10)
        },
        {
            "_id": ObjectId("65e100000000000000000002"),
            "title": "Unmonitored Industrial Runoff in Subarnarekha Tributary",
            "description": "Untreated metallurgical effluents and suspended solids discharge into the river stream, degrading irrigation canals and affecting over 10,000 farmers in the peri-urban agricultural belt.",
            "category": "Environment & Waste",
            "sub_category": "Industrial Waste Treatment",
            "urgency": "HIGH",
            "status": "MATCHED",
            "ai_analysis_status": "COMPLETED",
            "affected_people": 10000,
            "tags": ["Industrial Waste", "River Pollution", "Sensors", "IoT"],
            "location": {
                "latitude": 22.8046,
                "longitude": 86.2029,
                "address": "Mango River Basin",
                "city": "Jamshedpur",
                "district": "East Singhbhum",
                "state": "Jharkhand",
                "pincode": "831012",
                "coordinates": [86.2029, 22.8046]
            },
            "reporter_id": "65e000000000000000000002",
            "reporter_name": "Rohan Verma",
            "created_at": now - timedelta(days=20),
            "updated_at": now - timedelta(days=8)
        },
        {
            "_id": ObjectId("65e100000000000000000003"),
            "title": "Chronic Coal Dust Air Pollution & Respiratory Risks in Jharia",
            "description": "Open-cast mining and dust dispersion during coal transit cause particulate PM2.5 levels to exceed 300 ug/m3. Real-time air scrubbing and localized barrier filtration are urgently needed.",
            "category": "Environment & Waste",
            "sub_category": "Air Quality",
            "urgency": "CRITICAL",
            "status": "REPORTED",
            "ai_analysis_status": "COMPLETED",
            "affected_people": 45000,
            "tags": ["Coal Dust", "PM2.5", "Air Quality", "Mining"],
            "location": {
                "latitude": 23.7439,
                "longitude": 86.4178,
                "address": "Jharia Main Market Road",
                "city": "Dhanbad",
                "district": "Dhanbad",
                "state": "Jharkhand",
                "pincode": "828111",
                "coordinates": [86.4178, 23.7439]
            },
            "reporter_id": "65e000000000000000000002",
            "reporter_name": "Rohan Verma",
            "created_at": now - timedelta(days=15),
            "updated_at": now - timedelta(days=5)
        }
    ]

    for p in sample_problems:
        await problems_col.update_one({"_id": p["_id"]}, {"$set": p}, upsert=True)
    print(f"  [OK] {len(sample_problems)} Sample Problems seeded.")

    # -------------------------------------------------------------------------
    # 3. SEED AI ANALYSES & R&D BRIEFS
    # -------------------------------------------------------------------------
    print("\n[3/8] Seeding AI Analyses & Actionable R&D Briefs...")
    ai_col = db["ai_analyses"]

    sample_analyses = [
        {
            "_id": ObjectId("65e200000000000000000001"),
            "problem_id": "65e100000000000000000001",
            "status": "COMPLETED",
            "category": "Water & Sanitation",
            "subcategory": "Low-Cost Adsorbent Filtration",
            "priority": "HIGH",
            "priority_reason": "Direct human ingestion risks affecting school children with irreversibility.",
            "problem_type": "APPLIED_RESEARCH_AND_PROTOTYPING",
            "confidence": 0.94,
            "affected_domain": "Public Health & Environmental Engineering",
            "required_expertise": ["Bio-adsorbent Chemistry", "Micro-filtration Units", "IoT Water Turbidity Sensors"],
            "suggested_research_domains": ["Activated Bio-char Filtration", "Electrodialysis Reversal", "Solar UV Purification"],
            "suggested_solution_areas": ["Community-level Filter Skids", "Smart Handpump Retrofits"],
            "rnd_brief": {
                "problem_statement": "Deploy low-cost, decentralized filtration cartridges to extract fluoride and arsenic from rural borewells without grid electricity dependence.",
                "research_question": "Can locally sourced bio-char modified with iron-aluminum oxides achieve >90% fluoride adsorption at under ₹0.05/liter?",
                "current_situation": "Villages rely on raw borewell pumps yielding 4.2 ppm fluoride (WHO limit 1.5 ppm).",
                "expected_solution": "Gravity-fed multi-stage filtration column with telemetry reporting flow volume and filter saturation.",
                "stakeholders": ["Village Panchayat", "BIT Mesra Environmental Lab", "Tata Steel CSR"],
                "expected_impact": "Clean drinking water access for 2,500 villagers and eradication of school fluorosis symptoms.",
                "matching_keywords": ["Water", "Fluoride", "Filtration", "Biochar", "IoT", "Mesra"]
            },
            "created_at": now - timedelta(days=24)
        }
    ]

    for a in sample_analyses:
        await ai_col.update_one({"_id": a["_id"]}, {"$set": a}, upsert=True)
    print(f"  [OK] {len(sample_analyses)} AI Analyses seeded.")

    # -------------------------------------------------------------------------
    # 4. SEED MATCHES
    # -------------------------------------------------------------------------
    print("\n[4/8] Seeding Capability Matching Records...")
    matches_col = db["matches"]

    sample_matches = [
        {
            "_id": ObjectId("65e300000000000000000001"),
            "problem_id": "65e100000000000000000001",
            "target_id": "65e000000000000000000003",
            "target_type": "UNIVERSITY",
            "target_name": "BIT Mesra Environmental R&D Cell",
            "score": 92.5,
            "status": "ACCEPTED",
            "score_breakdown": {
                "expertise_match": 95.0,
                "domain_match": 90.0,
                "technology_match": 92.0,
                "location_proximity": 90.0,
                "category_alignment": 95.0
            },
            "rationale": "High domain match in Water Purification & IoT telemetry located within 15 km of problem site.",
            "created_at": now - timedelta(days=22)
        },
        {
            "_id": ObjectId("65e300000000000000000002"),
            "problem_id": "65e100000000000000000001",
            "target_id": "65e000000000000000000004",
            "target_type": "INDUSTRY",
            "target_name": "Tata Steel CSR & Sustainability Wing",
            "score": 88.0,
            "status": "ACCEPTED",
            "score_breakdown": {
                "expertise_match": 85.0,
                "domain_match": 88.0,
                "technology_match": 90.0,
                "location_proximity": 85.0,
                "category_alignment": 92.0
            },
            "rationale": "Offers CSR grant capital, sheet metal fabrication for skids, and field deployment logistics.",
            "created_at": now - timedelta(days=22)
        }
    ]

    for m in sample_matches:
        await matches_col.update_one({"_id": m["_id"]}, {"$set": m}, upsert=True)
    print(f"  [OK] {len(sample_matches)} Smart Matches seeded.")

    # -------------------------------------------------------------------------
    # 5. SEED COLLABORATIONS & PROJECTS
    # -------------------------------------------------------------------------
    print("\n[5/8] Seeding Active Multi-Stakeholder Collaboration Squad...")
    collab_col = db["collaborations"]
    projects_col = db["projects"]

    collab_doc = {
        "_id": ObjectId("65e400000000000000000001"),
        "title": "Project Nirmal-Jal: Harmu Fluoride Elimination Squad",
        "description": "Multi-stakeholder R&D alliance to develop and field-test biochar filtration columns with solar IoT telemetry.",
        "problem_id": "65e100000000000000000001",
        "university_id": "65e00000000000000000003",
        "industry_id": "65e00000000000000000004",
        "citizen_id": "65e00000000000000000002",
        "government_id": "65e00000000000000000005",
        "status": "PROTOTYPE",
        "mentor": "Prof. Arvind Sharma (BIT Mesra)",
        "members": [
            {"user_id": "65e000000000000000000003", "name": "Prof. Arvind Sharma", "role": "Lead Faculty Researcher"},
            {"user_id": "65e000000000000000000004", "name": "Priya Sen", "role": "CSR Industry Mentor"},
            {"user_id": "65e000000000000000000002", "name": "Rohan Verma", "role": "Community Champion"}
        ],
        "created_at": now - timedelta(days=18),
        "updated_at": now - timedelta(days=3)
    }
    await collab_col.update_one({"_id": collab_doc["_id"]}, {"$set": collab_doc}, upsert=True)

    project_doc = {
        "_id": ObjectId("65e500000000000000000001"),
        "title": "Low-Cost Activated Biochar Water Purification Skid",
        "description": "Engineering prototype and field validation of gravity water filters in Namkum pilot zone.",
        "problem_id": "65e100000000000000000001",
        "collaboration_id": "65e40000000000000000001",
        "university_id": "65e00000000000000000003",
        "industry_id": "65e00000000000000000004",
        "status": "IN_PROGRESS",
        "budget": 350000.0,
        "github_url": "https://github.com/civic2campus/nirmal-jal-hardware",
        "milestones": [
            {
                "id": "m1",
                "title": "Lab Biochar Adsorption Benchmarking",
                "description": "Validated 93.4% fluoride uptake in BIT Mesra Environmental Engineering wet lab.",
                "status": "COMPLETED",
                "target_date": (now - timedelta(days=10)).isoformat(),
                "completed_at": (now - timedelta(days=9)).isoformat()
            },
            {
                "id": "m2",
                "title": "Pilot Skid Fabrication & Solar Telemetry",
                "description": "Fabrication of stainless steel casing by Tata Steel CSR Workshop and ESP32 telemetry integration.",
                "status": "IN_PROGRESS",
                "target_date": (now + timedelta(days=14)).isoformat()
            },
            {
                "id": "m3",
                "title": "Field Deployment & Water Testing at Namkum Community School",
                "description": "Installation of 500 LPH filtration unit and third-party laboratory safety certification.",
                "status": "PENDING",
                "target_date": (now + timedelta(days=30)).isoformat()
            }
        ],
        "created_at": now - timedelta(days=17),
        "updated_at": now - timedelta(days=2)
    }
    await projects_col.update_one({"_id": project_doc["_id"]}, {"$set": project_doc}, upsert=True)
    print("  [OK] Collaboration Squad and Engineering Project seeded.")

    # -------------------------------------------------------------------------
    # 6. SEED DEPLOYED SOLUTIONS & IMPACT METRICS
    # -------------------------------------------------------------------------
    print("\n[6/8] Seeding Deployed Solutions & Real-World Impact...")
    solutions_col = db["solutions"]
    impact_col = db["impact_metrics"]

    solution_doc = {
        "_id": ObjectId("65e600000000000000000001"),
        "title": "Nirmal-Jal Mk-1 Community Water Skid",
        "description": "Solar-assisted modular fluoride extraction filter unit delivering 1,200 liters/hour of potable water.",
        "problem_id": "65e100000000000000000001",
        "project_id": "65e500000000000000000001",
        "solution_type": "Hardware + Bio-Filtration",
        "status": "DEPLOYED",
        "technology": ["Activated Biochar Column", "Solar UV Disinfection", "ESP32 IoT Turbidity Telemetry"],
        "deployment_location": "Namkum Primary Health Centre, Ranchi",
        "latitude": 23.3441,
        "longitude": 85.3096,
        "deployment_date": (now - timedelta(days=5)).isoformat(),
        "created_at": now - timedelta(days=6),
        "updated_at": now
    }
    await solutions_col.update_one({"_id": solution_doc["_id"]}, {"$set": solution_doc}, upsert=True)

    impact_doc = {
        "_id": ObjectId("65e700000000000000000001"),
        "solution_id": "65e60000000000000000001",
        "problem_id": "65e100000000000000000001",
        "people_benefited": 2500,
        "cost_saved_inr": 480000.0,
        "reduction_percentage": 92.5,
        "co2_reduction_kg": 1200.0,
        "feedback_rating": 4.9,
        "verification_status": "VERIFIED_BY_GOVERNMENT",
        "summary": "Provided safe potable drinking water to 2,500 villagers, reducing waterborne fluorosis symptoms by 92.5% and saving ₹4.8 Lakhs annually in commercial water tanker costs.",
        "created_at": now - timedelta(days=4)
    }
    await impact_col.update_one({"_id": impact_doc["_id"]}, {"$set": impact_doc}, upsert=True)
    print("  [OK] Solution and Verified Impact Metrics seeded.")

    # -------------------------------------------------------------------------
    # 7. SEED NOTIFICATIONS
    # -------------------------------------------------------------------------
    print("\n[7/8] Seeding In-App Notifications...")
    notif_col = db["notifications"]

    demo_notifications = [
        {
            "_id": ObjectId("65e800000000000000000001"),
            "user_id": "65e000000000000000000002",
            "type": NotificationType.PROBLEM_SUBMITTED.value,
            "title": "Problem Submission Received",
            "message": "Your report 'Severe Arsenic and Fluoride Groundwater Contamination' has been accepted for AI R&D analysis.",
            "related_id": "65e100000000000000000001",
            "related_type": "PROBLEM",
            "is_read": True,
            "created_at": now - timedelta(days=25)
        },
        {
            "_id": ObjectId("65e800000000000000000002"),
            "user_id": "65e000000000000000000002",
            "type": NotificationType.AI_ANALYSIS_COMPLETED.value,
            "title": "AI R&D Brief Generated",
            "message": "AI Engine has classified your problem as HIGH priority and drafted an actionable technical brief.",
            "related_id": "65e100000000000000000001",
            "related_type": "AI_ANALYSIS",
            "is_read": True,
            "created_at": now - timedelta(days=24)
        },
        {
            "_id": ObjectId("65e800000000000000000002"),
            "user_id": "65e000000000000000000003",
            "type": NotificationType.PROBLEM_MATCHED_UNIVERSITY.value,
            "title": "New Problem Matched with BIT Mesra",
            "message": "A 92.5% capability match was identified for Harmu Groundwater Contamination with your Environmental Lab.",
            "related_id": "65e100000000000000000001",
            "related_type": "MATCH",
            "is_read": False,
            "created_at": now - timedelta(days=22)
        },
        {
            "_id": ObjectId("65e800000000000000000004"),
            "user_id": "65e000000000000000000004",
            "type": NotificationType.PROBLEM_MATCHED_INDUSTRY.value,
            "title": "CSR Collaboration Opportunity",
            "message": "Tata Steel CSR has been matched with Project Nirmal-Jal for hardware fabrication sponsorship.",
            "related_id": "65e100000000000000000001",
            "related_type": "MATCH",
            "is_read": False,
            "created_at": now - timedelta(days=22)
        },
        {
            "_id": ObjectId("65e800000000000000000005"),
            "user_id": "65e000000000000000000002",
            "type": NotificationType.SOLUTION_DEPLOYED.value,
            "title": "Solution Successfully Deployed in Namkum!",
            "message": "Nirmal-Jal Mk-1 Community Water Skid has been installed at Namkum PHC, benefiting 2,500 citizens.",
            "related_id": "65e600000000000000000001",
            "related_type": "SOLUTION",
            "is_read": False,
            "created_at": now - timedelta(days=5)
        }
    ]

    for n in demo_notifications:
        await notif_col.update_one({"_id": n["_id"]}, {"$set": n}, upsert=True)
    print(f"  [OK] {len(demo_notifications)} Demo Notifications seeded.")

    # -------------------------------------------------------------------------
    # 8. SEED AUDIT LOGS
    # -------------------------------------------------------------------------
    print("\n[8/8] Seeding Governance Audit Logs...")
    audit_col = db["audit_logs"]

    demo_audit_logs = [
        {
            "_id": ObjectId("65e900000000000000000001"),
            "user_id": "65e000000000000000000001",
            "user_email": "admin@civic2campus.org",
            "user_role": "ADMIN",
            "action": "ORGANIZATION_VERIFICATION_APPROVED",
            "resource_type": "ORGANIZATION",
            "resource_id": "65e000000000000000000003",
            "metadata": {"org_name": "BIT Mesra", "status": "Approved"},
            "ip_address": "127.0.0.1",
            "created_at": now - timedelta(days=39)
        },
        {
            "_id": ObjectId("65e900000000000000000002"),
            "user_id": "65e000000000000000000001",
            "user_email": "admin@civic2campus.org",
            "user_role": "ADMIN",
            "action": "ORGANIZATION_VERIFICATION_APPROVED",
            "resource_type": "ORGANIZATION",
            "resource_id": "65e000000000000000000004",
            "metadata": {"org_name": "Tata Steel CSR", "status": "Approved"},
            "ip_address": "127.0.0.1",
            "created_at": now - timedelta(days=34)
        },
        {
            "_id": ObjectId("65e900000000000000000003"),
            "user_id": "65e000000000000000000005",
            "user_email": "jharkhand.urban@gov.in",
            "user_role": "GOVERNMENT",
            "action": "GOVERNMENT_IMPACT_VERIFIED",
            "resource_type": "IMPACT",
            "resource_id": "65e700000000000000000001",
            "metadata": {"people_benefited": 2500, "status": "VERIFIED"},
            "ip_address": "127.0.0.1",
            "created_at": now - timedelta(days=4)
        }
    ]

    for al in demo_audit_logs:
        await audit_col.update_one({"_id": al["_id"]}, {"$set": al}, upsert=True)
    print(f"  [OK] {len(demo_audit_logs)} Governance Audit Trail records seeded.")

    print("\n" + "=" * 70)
    print("DEMO CREDENTIALS FOR TESTING:")
    print("=" * 70)
    print("1. Citizen:    citizen@civic2campus.org    | Password: Citizen123!")
    print("2. University: univ@bitmesra.ac.in         | Password: Univ123!")
    print("3. Industry:   csr@tatasteel.com           | Password: Industry123!")
    print("4. Government: jharkhand.urban@gov.in      | Password: Gov123!")
    print("5. Admin:      admin@civic2campus.org      | Password: AdminSecret2026!")
    print("=" * 70)
    print("[OK] SEEDING COMPLETE! Civic2Campus Step 7 backend is fully populated.")
    print("=" * 70 + "\n")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
