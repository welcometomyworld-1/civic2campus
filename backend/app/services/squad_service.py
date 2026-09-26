import logging
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.models.squad import (
    StudentSquadDocument,
    SquadMember,
    SquadMilestone,
    SquadTask,
    SquadDocumentItem,
    FieldTestRecord,
    SquadImpactRecord,
    SquadActivityItem,
    SquadStatus,
    SquadPhase,
    StudentRole,
    SquadMilestoneStatus,
    SquadTaskPriority,
    SquadTaskStatus,
)

logger = logging.getLogger("civic2campus.squad_service")


class SquadService:
    @staticmethod
    async def generate_next_squad_id(db: AsyncIOMotorDatabase) -> str:
        """
        Auto-generates sequential unique Squad ID like SE-001, SE-002, etc.
        """
        count = await db.student_squads.count_documents({})
        next_num = count + 1
        candidate = f"SE-{next_num:03d}"

        # Double check candidate uniqueness (bounded loop)
        for _ in range(50):
            existing = await db.student_squads.find_one({"squad_id": candidate})
            if not existing:
                break
            next_num += 1
            candidate = f"SE-{next_num:03d}"

        return candidate

    @staticmethod
    async def create_squad(db: AsyncIOMotorDatabase, data: Dict[str, Any], created_by: str = "University Coordinator") -> Dict[str, Any]:
        """
        Creates a new student engineering squad with auto-generated ID, initial timeline, and linked problem.
        """
        if not data.get("squad_id"):
            data["squad_id"] = await SquadService.generate_next_squad_id(db)

        # Initial activity timeline
        now_str = datetime.utcnow().strftime("%b %d, %Y")
        initial_activity = SquadActivityItem(
            id=str(uuid.uuid4())[:8],
            date=now_str,
            user=created_by,
            action="Squad created",
            description=f"Squad '{data.get('name')}' registered with ID {data.get('squad_id')}."
        )

        timeline = data.get("activity_timeline", [])
        if not timeline:
            timeline = [initial_activity.dict()]
            data["activity_timeline"] = timeline

        # Ensure problem link record if problem_id is provided
        if data.get("problem_id") and not any(a.get("action") == "Problem assigned" for a in timeline):
            timeline.append({
                "id": str(uuid.uuid4())[:8],
                "date": now_str,
                "user": created_by,
                "action": "AI-matched problem assigned",
                "description": f"Assigned problem: {data.get('problem_title', 'Civic Challenge')}"
            })

        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()

        result = await db.student_squads.insert_one(data)
        created = await db.student_squads.find_one({"_id": result.inserted_id})
        created["_id"] = str(created["_id"])
        return created

    @staticmethod
    async def list_squads(
        db: AsyncIOMotorDatabase,
        search: Optional[str] = None,
        status: Optional[str] = None,
        department: Optional[str] = None,
        mentor: Optional[str] = None,
        industry: Optional[str] = None,
        current_phase: Optional[str] = None,
        sort_by: Optional[str] = "updated_at",
        sort_order: int = -1,
        skip: int = 0,
        limit: int = 50,
    ) -> Dict[str, Any]:
        """
        Lists squads with rich multi-field filtering, search, and sorting.
        """
        query: Dict[str, Any] = {}

        if status and status.upper() != "ALL":
            query["status"] = status.upper()

        if department and department.upper() != "ALL":
            query["$or"] = [
                {"department": {"$regex": department, "$options": "i"}},
                {"members.department": {"$regex": department, "$options": "i"}},
            ]

        if mentor and mentor.upper() != "ALL":
            query["faculty_mentor_name"] = {"$regex": mentor, "$options": "i"}

        if industry and industry.upper() != "ALL":
            query["industry_partner_name"] = {"$regex": industry, "$options": "i"}

        if current_phase and current_phase.upper() != "ALL":
            query["current_phase"] = current_phase.upper()

        if search:
            regex_search = {"$regex": search, "$options": "i"}
            search_clause = [
                {"name": regex_search},
                {"squad_id": regex_search},
                {"project_name": regex_search},
                {"problem_title": regex_search},
                {"team_leader_name": regex_search},
                {"members.name": regex_search},
                {"technologies": regex_search},
            ]
            if "$or" in query:
                query["$and"] = [{"$or": query.pop("$or")}, {"$or": search_clause}]
            else:
                query["$or"] = search_clause

        # Sort mapping
        sort_field = "updated_at"
        if sort_by == "progress":
            sort_field = "progress"
        elif sort_by == "name":
            sort_field = "name"
        elif sort_by == "squad_id":
            sort_field = "squad_id"
        elif sort_by == "target_date":
            sort_field = "target_date"

        cursor = db.student_squads.find(query).sort(sort_field, sort_order).skip(skip).limit(limit)
        items = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            items.append(doc)

        total = await db.student_squads.count_documents(query)
        return {
            "total": total,
            "items": items,
            "skip": skip,
            "limit": limit
        }

    @staticmethod
    async def get_squad_by_id(db: AsyncIOMotorDatabase, squad_id_or_obj_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches squad by either squad_id (e.g. SE-001) or MongoDB ObjectId string.
        """
        query: Dict[str, Any] = {"squad_id": squad_id_or_obj_id}
        if ObjectId.is_valid(squad_id_or_obj_id):
            query = {"$or": [{"_id": ObjectId(squad_id_or_obj_id)}, {"squad_id": squad_id_or_obj_id}]}

        doc = await db.student_squads.find_one(query)
        if doc:
            doc["_id"] = str(doc["_id"])
            # If linked problem exists, enrich with AI brief
            if doc.get("problem_id"):
                prob = await db.problems.find_one({"_id": ObjectId(doc["problem_id"]) if ObjectId.is_valid(doc["problem_id"]) else doc["problem_id"]})
                if prob:
                    doc["problem_detail"] = {
                        "id": str(prob.get("_id")),
                        "title": prob.get("title"),
                        "description": prob.get("description"),
                        "category": prob.get("category"),
                        "location": prob.get("location"),
                        "urgency": prob.get("urgency"),
                        "ai_analysis": prob.get("ai_analysis"),
                    }
        return doc

    @staticmethod
    async def update_squad(db: AsyncIOMotorDatabase, squad_id: str, update_data: Dict[str, Any], user_name: str = "University User") -> Optional[Dict[str, Any]]:
        """
        Updates squad metadata and appends timeline entry if significant status/phase changed.
        """
        update_data["updated_at"] = datetime.utcnow()

        # Check existing
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        # Detect changes for timeline
        timeline = existing.get("activity_timeline", [])
        now_str = datetime.utcnow().strftime("%b %d, %Y")

        if "current_phase" in update_data and update_data["current_phase"] != existing.get("current_phase"):
            timeline.append({
                "id": str(uuid.uuid4())[:8],
                "date": now_str,
                "user": user_name,
                "action": "Phase advanced",
                "description": f"Phase progressed from {existing.get('current_phase')} to {update_data['current_phase']} ({update_data.get('progress', existing.get('progress', 0))}% complete)."
            })
            update_data["activity_timeline"] = timeline

        if "industry_partner_name" in update_data and update_data["industry_partner_name"] != existing.get("industry_partner_name"):
            timeline.append({
                "id": str(uuid.uuid4())[:8],
                "date": now_str,
                "user": user_name,
                "action": "Industry mentor linked",
                "description": f"Partnered with {update_data['industry_partner_name']}."
            })
            update_data["activity_timeline"] = timeline

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {"$set": update_data}
        )

        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def delete_squad(db: AsyncIOMotorDatabase, squad_id: str) -> bool:
        """
        Deletes squad safely from MongoDB.
        """
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return False
        result = await db.student_squads.delete_one({"_id": ObjectId(existing["_id"])})
        return result.deleted_count > 0

    @staticmethod
    async def add_member(db: AsyncIOMotorDatabase, squad_id: str, member_data: Dict[str, Any], user_name: str = "University Coordinator") -> Optional[Dict[str, Any]]:
        """
        Adds a student to the squad.
        """
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        members = existing.get("members", [])
        if len(members) >= existing.get("max_team_size", 6):
            raise ValueError(f"Squad maximum team size ({existing.get('max_team_size', 6)}) reached.")

        # Check duplicate
        if any(m.get("student_id") == member_data.get("student_id") for m in members):
            raise ValueError(f"Student with ID '{member_data.get('student_id')}' already exists in squad.")

        members.append(member_data)
        timeline = existing.get("activity_timeline", [])
        now_str = datetime.utcnow().strftime("%b %d, %Y")
        timeline.append({
            "id": str(uuid.uuid4())[:8],
            "date": now_str,
            "user": user_name,
            "action": "Student member added",
            "description": f"{member_data.get('name')} ({member_data.get('role', 'DEVELOPER')}) joined the squad."
        })

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "members": members,
                    "activity_timeline": timeline,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def update_member(db: AsyncIOMotorDatabase, squad_id: str, student_id: str, member_update: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        members = existing.get("members", [])
        updated = False
        for idx, m in enumerate(members):
            if m.get("student_id") == student_id:
                members[idx] = {**m, **member_update}
                updated = True
                break

        if not updated:
            return None

        # If role changed to TEAM_LEADER, also update team_leader_id and name
        updates: Dict[str, Any] = {
            "members": members,
            "updated_at": datetime.utcnow()
        }
        if member_update.get("role") == "TEAM_LEADER":
            updates["team_leader_id"] = student_id
            updates["team_leader_name"] = member_update.get("name")

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {"$set": updates}
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def remove_member(db: AsyncIOMotorDatabase, squad_id: str, student_id: str, user_name: str = "University Coordinator") -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        members = [m for m in existing.get("members", []) if m.get("student_id") != student_id]
        timeline = existing.get("activity_timeline", [])
        now_str = datetime.utcnow().strftime("%b %d, %Y")
        timeline.append({
            "id": str(uuid.uuid4())[:8],
            "date": now_str,
            "user": user_name,
            "action": "Student member removed",
            "description": f"Student {student_id} was removed from squad roster."
        })

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "members": members,
                    "activity_timeline": timeline,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def add_milestone(db: AsyncIOMotorDatabase, squad_id: str, milestone_data: Dict[str, Any], user_name: str = "University Coordinator") -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        if not milestone_data.get("id"):
            milestone_data["id"] = f"m-{str(uuid.uuid4())[:6]}"

        milestones = existing.get("milestones", [])
        milestones.append(milestone_data)

        timeline = existing.get("activity_timeline", [])
        now_str = datetime.utcnow().strftime("%b %d, %Y")
        timeline.append({
            "id": str(uuid.uuid4())[:8],
            "date": now_str,
            "user": user_name,
            "action": "Milestone defined",
            "description": f"Added milestone: '{milestone_data.get('title')}'."
        })

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "milestones": milestones,
                    "activity_timeline": timeline,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def update_milestone(db: AsyncIOMotorDatabase, squad_id: str, milestone_id: str, milestone_update: Dict[str, Any], user_name: str = "University Coordinator") -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        milestones = existing.get("milestones", [])
        timeline = existing.get("activity_timeline", [])
        now_str = datetime.utcnow().strftime("%b %d, %Y")

        for idx, m in enumerate(milestones):
            if m.get("id") == milestone_id:
                if milestone_update.get("status") == "COMPLETED" and m.get("status") != "COMPLETED":
                    milestone_update["completed_at"] = now_str
                    timeline.append({
                        "id": str(uuid.uuid4())[:8],
                        "date": now_str,
                        "user": user_name,
                        "action": "Milestone completed",
                        "description": f"Completed: '{m.get('title')}'."
                    })
                milestones[idx] = {**m, **milestone_update}
                break

        # Calculate auto progress if all milestones have progress
        if milestones:
            avg_progress = int(sum(m.get("progress", 0) for m in milestones) / len(milestones))
        else:
            avg_progress = existing.get("progress", 0)

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "milestones": milestones,
                    "progress": avg_progress,
                    "activity_timeline": timeline,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def add_task(db: AsyncIOMotorDatabase, squad_id: str, task_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        if not task_data.get("id"):
            task_data["id"] = f"t-{str(uuid.uuid4())[:6]}"

        tasks = existing.get("tasks", [])
        tasks.append(task_data)

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "tasks": tasks,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def update_task(db: AsyncIOMotorDatabase, squad_id: str, task_id: str, task_update: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        tasks = existing.get("tasks", [])
        for idx, t in enumerate(tasks):
            if t.get("id") == task_id:
                tasks[idx] = {**t, **task_update}
                break

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "tasks": tasks,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def add_field_test(db: AsyncIOMotorDatabase, squad_id: str, test_data: Dict[str, Any], user_name: str = "Squad Lead") -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        if not test_data.get("id"):
            test_data["id"] = f"ft-{str(uuid.uuid4())[:6]}"

        field_tests = existing.get("field_testing", [])
        field_tests.append(test_data)

        timeline = existing.get("activity_timeline", [])
        now_str = datetime.utcnow().strftime("%b %d, %Y")
        timeline.append({
            "id": str(uuid.uuid4())[:8],
            "date": now_str,
            "user": user_name,
            "action": "Field testing conducted",
            "description": f"Field trial at {test_data.get('location')} ({test_data.get('status', 'COMPLETED')})."
        })

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "field_testing": field_tests,
                    "activity_timeline": timeline,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def add_document(db: AsyncIOMotorDatabase, squad_id: str, doc_data: Dict[str, Any], user_name: str = "Student Engineer") -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        if not doc_data.get("id"):
            doc_data["id"] = f"doc-{str(uuid.uuid4())[:6]}"
        if not doc_data.get("upload_date"):
            doc_data["upload_date"] = datetime.utcnow().strftime("%b %d, %Y")

        documents = existing.get("documents", [])
        documents.append(doc_data)

        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "documents": documents,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def delete_document(db: AsyncIOMotorDatabase, squad_id: str, document_id: str) -> Optional[Dict[str, Any]]:
        existing = await SquadService.get_squad_by_id(db, squad_id)
        if not existing:
            return None

        documents = [d for d in existing.get("documents", []) if d.get("id") != document_id]
        await db.student_squads.update_one(
            {"_id": ObjectId(existing["_id"])},
            {
                "$set": {
                    "documents": documents,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await SquadService.get_squad_by_id(db, squad_id)

    @staticmethod
    async def get_summary_kpis(db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        """
        Aggregates live summary statistics for University Dashboard KPI cards.
        """
        total_squads = await db.student_squads.count_documents({})
        active_squads = await db.student_squads.count_documents({"status": "ACTIVE"})
        completed_squads = await db.student_squads.count_documents({"status": "COMPLETED"})

        # Count participating students and field trials across all squads
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_students": {"$sum": {"$size": {"$ifNull": ["$members", []]}}},
                    "total_field_trials": {"$sum": {"$size": {"$ifNull": ["$field_testing", []]}}},
                    "total_documents": {"$sum": {"$size": {"$ifNull": ["$documents", []]}}},
                }
            }
        ]
        agg_result = await db.student_squads.aggregate(pipeline).to_list(1)
        students_count = agg_result[0]["total_students"] if agg_result else 0
        field_trials_count = agg_result[0]["total_field_trials"] if agg_result else 0

        # Solutions developed: squads in DEPLOYMENT or COMPLETED phases
        solutions_developed = await db.student_squads.count_documents({
            "current_phase": {"$in": ["DEPLOYMENT", "COMPLETED"]}
        })

        return {
            "total_squads": total_squads,
            "active_squads": active_squads,
            "completed_squads": completed_squads,
            "students_participating": students_count,
            "projects_in_progress": active_squads,
            "field_trials": field_trials_count,
            "solutions_developed": solutions_developed,
        }

    @staticmethod
    async def seed_initial_squads_if_needed(db: AsyncIOMotorDatabase):
        """
        Seeds rich, production-grade initial squads for Jharkhand universities if collection is empty.
        """
        count = await db.student_squads.count_documents({})
        if count > 0:
            return

        logger.info("Seeding initial student engineering squads into MongoDB...")

        sample_squads = [
            {
                "squad_id": "SE-001",
                "name": "Smart Water Innovation Squad",
                "description": "Multidisciplinary squad developing solar-powered IoT water telemetry stations for high fluorosis groundwater pockets in Toto Block.",
                "project_name": "AI Water Quality Monitoring",
                "problem_title": "Rural handpump fluorosis & iron contamination in Toto Block, Gumla",
                "problem_category": "Water & Sanitation",
                "problem_location": "Toto Block, Gumla District",
                "problem_priority": "CRITICAL",
                "ai_match_score": 96,
                "team_leader_name": "Rahul Kumar",
                "team_leader_id": "STU-101",
                "members": [
                    {
                        "student_id": "STU-101",
                        "name": "Rahul Kumar",
                        "email": "rahul.k@bitmesra.ac.in",
                        "department": "CSE",
                        "year": 4,
                        "skills": ["Python", "FastAPI", "IoT Gateway", "GIS Mapping"],
                        "role": "TEAM_LEADER",
                        "current_task": "Cloud Ingestion & Telemetry Dashboard",
                        "task_status": "IN_PROGRESS",
                        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    },
                    {
                        "student_id": "STU-102",
                        "name": "Pooja Kumari",
                        "email": "pooja.ece@bitmesra.ac.in",
                        "department": "ECE",
                        "year": 3,
                        "skills": ["LoRaWAN", "Embedded C", "Sensor PCB Design"],
                        "role": "DEVELOPER",
                        "current_task": "Low-power Sleep Mode Calibration",
                        "task_status": "COMPLETED",
                        "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                    },
                    {
                        "student_id": "STU-103",
                        "name": "Rahul Munda",
                        "email": "rahul.m@bitmesra.ac.in",
                        "department": "Civil & Env",
                        "year": 4,
                        "skills": ["Water Hydrology", "Fluoride Assays", "Field Surveys"],
                        "role": "DOMAIN_SPECIALIST",
                        "current_task": "Groundwater Sample Lab Validation",
                        "task_status": "IN_PROGRESS",
                        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    },
                    {
                        "student_id": "STU-104",
                        "name": "Sneha Hansda",
                        "email": "sneha.ai@bitmesra.ac.in",
                        "department": "AI & ML",
                        "year": 3,
                        "skills": ["Anomaly Detection", "Time Series ML", "Pandas"],
                        "role": "DATA_ANALYST",
                        "current_task": "Predictive Contamination Spike Model",
                        "task_status": "TODO",
                        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    }
                ],
                "max_team_size": 6,
                "faculty_mentor_name": "Dr. Alok Verma",
                "faculty_mentor_email": "alok.verma@bitmesra.ac.in",
                "faculty_mentor_department": "Dept of Environmental Engineering",
                "industry_partner_name": "Tata Steel CSR Foundation",
                "industry_partner_mentor": "Mr. Rajiv Singhania",
                "industry_partner_designation": "Head of Rural Water Innovation",
                "industry_partner_email": "rajiv.s@tatasteel.com",
                "industry_support_type": "FUNDING",
                "funding_received": "₹2,50,000",
                "government_partner": "Drinking Water & Sanitation Dept, Ranchi",
                "department": "Civil & Environmental Engineering",
                "course": "B.Tech Engineering",
                "year": 4,
                "research_area": "IoT Water Quality & Heavy Metal Telemetry",
                "technologies": ["LoRaWAN", "ESP32", "Python", "FastAPI", "Leaflet Maps"],
                "objectives": [
                    "Continuous telemetry of Fluoride (F-) and TDS in 12 Toto handpumps",
                    "Solar-powered node with 7-day battery backup during monsoon",
                    "Automated SMS alerts to Mukhiya and Block Development Officer"
                ],
                "expected_outcome": "Field-ready IP67 telemetry probe preventing fluorosis in 12,500 villagers.",
                "current_phase": "TESTING",
                "progress": 72,
                "status": "ACTIVE",
                "start_date": "2026-08-01",
                "target_date": "2026-11-30",
                "milestones": [
                    {
                        "id": "m-101",
                        "title": "Problem Site Survey & Lab Assay",
                        "description": "Collected 45 baseline borewell samples across Toto Block.",
                        "due_date": "2026-08-15",
                        "responsible_member": "Rahul Munda",
                        "status": "COMPLETED",
                        "progress": 100,
                        "completed_at": "2026-08-14"
                    },
                    {
                        "id": "m-102",
                        "title": "Dual-Sensor Prototype & Firmware",
                        "description": "Assembled ESP32 + ISE Fluoride probe with LoRaWAN telemetry.",
                        "due_date": "2026-09-05",
                        "responsible_member": "Pooja Kumari",
                        "status": "COMPLETED",
                        "progress": 100,
                        "completed_at": "2026-09-04"
                    },
                    {
                        "id": "m-103",
                        "title": "Field Pilot Testing in 3 Handpumps",
                        "description": "Install weather-sealed nodes and verify 24/7 solar charging.",
                        "due_date": "2026-10-10",
                        "responsible_member": "Rahul Kumar",
                        "status": "IN_PROGRESS",
                        "progress": 65
                    },
                    {
                        "id": "m-104",
                        "title": "State Portal Dashboard Integration",
                        "description": "Feed live TDS and Fluoride alerts into Jharkhand Gov Command Center.",
                        "due_date": "2026-11-15",
                        "responsible_member": "Sneha Hansda",
                        "status": "PENDING",
                        "progress": 0
                    }
                ],
                "tasks": [
                    {
                        "id": "t-101",
                        "title": "Calibrate Ion-Selective Electrodes",
                        "description": "Use standard 1.0 ppm and 5.0 ppm Fluoride buffer solutions.",
                        "assigned_member": "Pooja Kumari",
                        "priority": "CRITICAL",
                        "due_date": "2026-09-22",
                        "status": "IN_PROGRESS"
                    },
                    {
                        "id": "t-102",
                        "title": "Solar Charge Controller Enclosure Design",
                        "description": "3D print waterproof ABS casing with UV resistance.",
                        "assigned_member": "Rahul Kumar",
                        "priority": "HIGH",
                        "due_date": "2026-09-25",
                        "status": "TODO"
                    },
                    {
                        "id": "t-103",
                        "title": "Panchayat Verification Meeting",
                        "description": "Demonstrate green/red LED water safety indicator to Toto Panchayat.",
                        "assigned_member": "Rahul Munda",
                        "priority": "MEDIUM",
                        "due_date": "2026-10-02",
                        "status": "TODO"
                    }
                ],
                "documents": [
                    {
                        "id": "doc-101",
                        "name": "Toto_Groundwater_Fluoride_Survey_Report_V1.pdf",
                        "type": "Field survey",
                        "uploaded_by": "Rahul Munda",
                        "upload_date": "Aug 18, 2026",
                        "version": "1.0",
                        "url": "/uploads/squads/SE-001/survey_report.pdf"
                    },
                    {
                        "id": "doc-102",
                        "name": "SmartWater_Schematic_PCB_V2.pdf",
                        "type": "Design files",
                        "uploaded_by": "Pooja Kumari",
                        "upload_date": "Sep 05, 2026",
                        "version": "2.1",
                        "url": "/uploads/squads/SE-001/pcb_schematic.pdf"
                    }
                ],
                "field_testing": [
                    {
                        "id": "ft-101",
                        "location": "Toto Primary Health Center Handpump #4",
                        "date": "Sep 15, 2026",
                        "objective": "72-hour continuous telemetry stability test under direct rainfall.",
                        "participants": ["Rahul Kumar", "Pooja Kumari", "Gram Pradhan Smt. M. Oraon"],
                        "observed_results": "Telemetry uplink received every 15 minutes; Fluoride measured at 2.4 ppm (Dangerous).",
                        "issues_found": "Slight condensation on outer antenna seal.",
                        "feedback": "Panchayat immediately diverted drinking usage to alternate deep borewell.",
                        "photos_videos": [],
                        "status": "COMPLETED"
                    }
                ],
                "impact": {
                    "people_benefited": 12500,
                    "area_covered": "Toto & Bishunpur Blocks (14 Panchayats)",
                    "problem_resolution_percentage": 75,
                    "cost_saved": "₹3,40,000",
                    "time_saved": "45 Days",
                    "environmental_impact": "Zero consumable chemical reagent waste with solid-state ISE sensor",
                    "community_feedback": "Villagers expressed immense relief having real-time water safety indicators.",
                    "deployment_date": "2026-10-15"
                },
                "activity_timeline": [
                    {
                        "id": "act-1",
                        "date": "Aug 01, 2026",
                        "user": "Prof. Arvind Sharma (Dean R&D)",
                        "action": "Squad created",
                        "description": "Smart Water Innovation Squad initialized for Toto fluorosis mitigation."
                    },
                    {
                        "id": "act-2",
                        "date": "Aug 05, 2026",
                        "user": "AI Matching Engine",
                        "action": "AI-matched problem assigned",
                        "description": "Problem 'Rural handpump fluorosis in Toto' assigned with 96% AI capability match score."
                    },
                    {
                        "id": "act-3",
                        "date": "Aug 14, 2026",
                        "user": "Rahul Munda",
                        "action": "Milestone completed",
                        "description": "Milestone 'Problem Site Survey & Lab Assay' completed successfully."
                    },
                    {
                        "id": "act-4",
                        "date": "Aug 25, 2026",
                        "user": "Tata Steel CSR",
                        "action": "Industry mentor linked",
                        "description": "Mr. Rajiv Singhania (Tata Steel) assigned as industry technical mentor with ₹2,50,000 grant."
                    },
                    {
                        "id": "act-5",
                        "date": "Sep 15, 2026",
                        "user": "Rahul Kumar",
                        "action": "Field testing conducted",
                        "description": "72-hr telemetry stability test completed at Toto PHC Handpump #4."
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "squad_id": "SE-002",
                "name": "Solar Cold Chain Squad",
                "description": "Engineering portable 12V DC phase-change solar cold storage for rural tribal vegetable and mahua farmers in Bishunpur.",
                "project_name": "Decentralized Solar Cold Storage",
                "problem_title": "Post-harvest vegetable spoilage in off-grid tribal markets",
                "problem_category": "Agriculture & Livelihood",
                "problem_location": "Bishunpur Block, Gumla",
                "problem_priority": "HIGH",
                "ai_match_score": 92,
                "team_leader_name": "Amit Kerketta",
                "team_leader_id": "STU-201",
                "members": [
                    {
                        "student_id": "STU-201",
                        "name": "Amit Kerketta",
                        "email": "amit.k@bitmesra.ac.in",
                        "department": "Mechanical Eng",
                        "year": 4,
                        "skills": ["Thermal Engineering", "SolidWorks", "HVAC Design"],
                        "role": "TEAM_LEADER",
                        "current_task": "Phase Change Material (PCM) Thermal Modeling",
                        "task_status": "IN_PROGRESS",
                        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                    },
                    {
                        "student_id": "STU-202",
                        "name": "Nisha Topno",
                        "email": "nisha.t@bitmesra.ac.in",
                        "department": "EEE",
                        "year": 3,
                        "skills": ["Solar MPPT", "BLDC Motor Drives", "Battery BMS"],
                        "role": "DEVELOPER",
                        "current_task": "48V LiFePO4 Battery Controller Wiring",
                        "task_status": "IN_PROGRESS",
                        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                    },
                    {
                        "student_id": "STU-203",
                        "name": "Deepak Gope",
                        "email": "deepak.g@bitmesra.ac.in",
                        "department": "Agriculture Eng",
                        "year": 4,
                        "skills": ["Post-harvest Storage", "Humidity Control", "Supply Chain"],
                        "role": "DOMAIN_SPECIALIST",
                        "current_task": "Tomato & Green Chilli Shelf-life Study",
                        "task_status": "COMPLETED",
                        "avatar_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
                    }
                ],
                "max_team_size": 5,
                "faculty_mentor_name": "Dr. Manisha Roy",
                "faculty_mentor_email": "manisha.roy@bitmesra.ac.in",
                "faculty_mentor_department": "Mechanical Engineering Dept",
                "industry_partner_name": "Coal India Innovation CSR",
                "industry_partner_mentor": "Dr. Vikas Sen",
                "industry_partner_designation": "Renewable Energy Director",
                "industry_partner_email": "vikas.sen@coalindia.gov.in",
                "industry_support_type": "TECHNOLOGY",
                "funding_received": "₹4,00,000",
                "government_partner": "Dept of Agriculture & Animal Husbandry",
                "department": "Mechanical Engineering",
                "course": "B.Tech Engineering",
                "year": 4,
                "research_area": "Solar Thermal Cold Storage & PCM",
                "technologies": ["BLDC Compressor", "LiFePO4 BMS", "PCM Salt Hydrates", "IoT Temperature"],
                "objectives": [
                    "Maintain 4°C - 8°C temperature without grid electricity for 36 hours",
                    "Capacity of 250 kg perishable produce per portable module",
                    "Cost below ₹45,000 per unit for village SHG affordability"
                ],
                "expected_outcome": "Field pilot reducing post-harvest tomato losses from 35% to under 4%.",
                "current_phase": "PROTOTYPE",
                "progress": 60,
                "status": "ACTIVE",
                "start_date": "2026-07-15",
                "target_date": "2026-12-20",
                "milestones": [
                    {
                        "id": "m-201",
                        "title": "PCM Thermal Chamber Fabrication",
                        "description": "Insulated polyurethane cabinet with salt hydrate thermal buffer.",
                        "due_date": "2026-08-30",
                        "responsible_member": "Amit Kerketta",
                        "status": "COMPLETED",
                        "progress": 100,
                        "completed_at": "2026-08-28"
                    },
                    {
                        "id": "m-202",
                        "title": "Solar MPPT Inverter & BLDC Integration",
                        "description": "Direct solar DC drive integration without heavy AC inverters.",
                        "due_date": "2026-09-30",
                        "responsible_member": "Nisha Topno",
                        "status": "IN_PROGRESS",
                        "progress": 70
                    }
                ],
                "tasks": [
                    {
                        "id": "t-201",
                        "title": "Benchtop Coefficient of Performance (COP) test",
                        "description": "Test refrigeration cycle at 42°C ambient temperature.",
                        "assigned_member": "Amit Kerketta",
                        "priority": "HIGH",
                        "due_date": "2026-09-28",
                        "status": "IN_PROGRESS"
                    }
                ],
                "documents": [
                    {
                        "id": "doc-201",
                        "name": "Solar_Cold_Storage_Thermal_Simulation.pdf",
                        "type": "Project reports",
                        "uploaded_by": "Amit Kerketta",
                        "upload_date": "Sep 01, 2026",
                        "version": "1.2",
                        "url": "/uploads/squads/SE-002/thermal_simulation.pdf"
                    }
                ],
                "field_testing": [],
                "impact": {
                    "people_benefited": 4800,
                    "area_covered": "Bishunpur Tribal Haats",
                    "problem_resolution_percentage": 60,
                    "cost_saved": "₹2,10,000",
                    "time_saved": "20 Days",
                    "environmental_impact": "Displaces diesel generator cold vans, saving 1.2 metric tonnes CO2/yr",
                    "community_feedback": "Farmer Producer Org (FPO) requested 5 units for potato & tomato preservation.",
                    "deployment_date": "2026-11-01"
                },
                "activity_timeline": [
                    {
                        "id": "act-201",
                        "date": "Jul 15, 2026",
                        "user": "Prof. Arvind Sharma",
                        "action": "Squad created",
                        "description": "Solar Cold Chain Squad registered."
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "squad_id": "SE-003",
                "name": "Mine Runoff Remediation Squad",
                "description": "Developing biochar-zeolite permeable reactive barrier filters to treat acidic coal mine runoff water in Damodar catchment.",
                "project_name": "Biochar Zeolite Acid Mine Drainage Filter",
                "problem_title": "Acid mine drainage and heavy metals contaminating Damodar tributary",
                "problem_category": "Environment & Waste",
                "problem_location": "Bokaro & Dhanbad Coalfield Belt",
                "problem_priority": "CRITICAL",
                "ai_match_score": 94,
                "team_leader_name": "Rohan Tirkey",
                "team_leader_id": "STU-301",
                "members": [
                    {
                        "student_id": "STU-301",
                        "name": "Rohan Tirkey",
                        "email": "rohan.t@bitmesra.ac.in",
                        "department": "Chemical Eng",
                        "year": 4,
                        "skills": ["Adsorption Chemistry", "Pyrolysis", "Spectroscopy"],
                        "role": "TEAM_LEADER",
                        "current_task": "Bamboo Biochar Activation with Alkali",
                        "task_status": "COMPLETED",
                        "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
                    },
                    {
                        "student_id": "STU-302",
                        "name": "Anjali Soren",
                        "email": "anjali.s@bitmesra.ac.in",
                        "department": "Civil Eng",
                        "year": 3,
                        "skills": ["Hydraulic Modeling", "Filter Bed Sizing"],
                        "role": "DEVELOPER",
                        "current_task": "Gravity Flow Rate Optimization",
                        "task_status": "IN_PROGRESS",
                        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    }
                ],
                "max_team_size": 4,
                "faculty_mentor_name": "Dr. Pradeep Mishra",
                "faculty_mentor_email": "pmishra@bitmesra.ac.in",
                "faculty_mentor_department": "Chemical Engineering",
                "industry_partner_name": "Jindal Steel CSR",
                "industry_partner_mentor": "Er. S. Chatterjee",
                "industry_partner_designation": "Effluent Treatment Chief",
                "industry_partner_email": "s.chatterjee@jindalsteel.com",
                "industry_support_type": "R&D",
                "funding_received": "₹3,20,000",
                "government_partner": "Jharkhand State Pollution Control Board",
                "department": "Chemical Engineering",
                "course": "B.Tech Engineering",
                "year": 4,
                "research_area": "Acid Mine Drainage (AMD) Remediation",
                "technologies": ["Activated Biochar", "Natural Clinoptilolite Zeolite", "Gravity Bed"],
                "objectives": [
                    "Neutralize AMD pH from 2.8 to 6.8+",
                    "95%+ removal of Fe, Mn, and Sulfate ions",
                    "Regenerable filter media with 6-month field lifespan"
                ],
                "expected_outcome": "Low-cost passive permeable reactive filter deployed at 3 open cast coal drain outlets.",
                "current_phase": "FIELD_TRIAL",
                "progress": 85,
                "status": "ACTIVE",
                "start_date": "2026-06-01",
                "target_date": "2026-11-15",
                "milestones": [
                    {
                        "id": "m-301",
                        "title": "Benchtop Column Breakthrough Study",
                        "description": "Validated 100 bed volumes with zero heavy metal breakthrough.",
                        "due_date": "2026-07-20",
                        "responsible_member": "Rohan Tirkey",
                        "status": "COMPLETED",
                        "progress": 100,
                        "completed_at": "2026-07-18"
                    },
                    {
                        "id": "m-302",
                        "title": "500 L/hr Pilot Filter Deployment",
                        "description": "Install modular steel reactor at Bermo coal discharge drain.",
                        "due_date": "2026-09-10",
                        "responsible_member": "Anjali Soren",
                        "status": "COMPLETED",
                        "progress": 100,
                        "completed_at": "2026-09-08"
                    }
                ],
                "tasks": [],
                "documents": [],
                "field_testing": [
                    {
                        "id": "ft-301",
                        "location": "Bermo Open Cast Mine Drain #2, Bokaro",
                        "date": "Sep 09, 2026",
                        "objective": "Measure pH and Iron concentration before and after 24 hrs continuous throughput.",
                        "participants": ["Rohan Tirkey", "Anjali Soren", "JSPCB Inspection Officer"],
                        "observed_results": "Inlet pH: 3.1 ➔ Outlet pH: 7.2; Total Iron reduced from 18.4 mg/L to 0.2 mg/L.",
                        "issues_found": "Filter media requires weekly backwash to clear heavy silt.",
                        "feedback": "JSPCB certified compliant for agricultural discharge.",
                        "photos_videos": [],
                        "status": "COMPLETED"
                    }
                ],
                "impact": {
                    "people_benefited": 28000,
                    "area_covered": "Damodar downstream (32 agricultural villages)",
                    "problem_resolution_percentage": 90,
                    "cost_saved": "₹8,50,000",
                    "time_saved": "90 Days",
                    "environmental_impact": "Restores aquatic biodiversity across 12 km stretch of river basin",
                    "community_feedback": "Downstream farmers resumed paddy irrigation safely without soil acidification.",
                    "deployment_date": "2026-09-12"
                },
                "activity_timeline": [
                    {
                        "id": "act-301",
                        "date": "Jun 01, 2026",
                        "user": "Prof. Arvind Sharma",
                        "action": "Squad created",
                        "description": "Mine Runoff Remediation Squad registered."
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]

        await db.student_squads.insert_many(sample_squads)
        logger.info(f"Successfully seeded {len(sample_squads)} initial student squads.")
