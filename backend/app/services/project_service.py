import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.user import UserRole
from app.models.project import ProjectStatus, MilestoneStatus, Milestone
from app.schemas.user import UserProfileResponse
from app.schemas.project import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
    MilestoneCreateRequest,
    MilestoneUpdateRequest,
    ProjectResponse,
    ProjectListResponse,
)

logger = logging.getLogger("civic2campus.project_service")


class ProjectService:
    """
    Service managing civic engineering & prototyping projects and milestone tracking.
    """

    @staticmethod
    def _doc_to_response(doc: Dict[str, Any]) -> ProjectResponse:
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]

        milestones_raw = doc_copy.get("milestones", [])
        parsed_milestones = []
        for m in milestones_raw:
            if isinstance(m, dict):
                parsed_milestones.append(Milestone(**m))
            elif isinstance(m, Milestone):
                parsed_milestones.append(m)

        return ProjectResponse(
            id=doc_copy["id"],
            name=doc_copy["name"],
            problem_id=str(doc_copy["problem_id"]),
            problem_title=doc_copy.get("problem_title"),
            collaboration_id=doc_copy.get("collaboration_id"),
            university_id=doc_copy.get("university_id"),
            university_name=doc_copy.get("university_name"),
            industry_id=doc_copy.get("industry_id"),
            industry_name=doc_copy.get("industry_name"),
            team_members=doc_copy.get("team_members", []),
            mentor=doc_copy.get("mentor"),
            description=doc_copy["description"],
            objectives=doc_copy.get("objectives", []),
            milestones=parsed_milestones,
            progress=float(doc_copy.get("progress", 0.0)),
            documents=doc_copy.get("documents", []),
            status=ProjectStatus(doc_copy.get("status", ProjectStatus.ACTIVE.value)),
            start_date=doc_copy.get("start_date"),
            target_date=doc_copy.get("target_date"),
            created_at=doc_copy.get("created_at", datetime.utcnow()),
            updated_at=doc_copy.get("updated_at", datetime.utcnow()),
        )

    @classmethod
    async def create_project(
        cls,
        db: AsyncIOMotorDatabase,
        current_user: UserProfileResponse,
        payload: ProjectCreateRequest
    ) -> ProjectResponse:
        """
        Creates a new R&D/prototyping project for a civic challenge.
        """
        problems_col = db["problems"]
        projects_col = db["projects"]

        try:
            prob_oid = ObjectId(payload.problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": prob_oid})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        now = datetime.utcnow()
        doc = payload.model_dump()
        doc["problem_title"] = problem.get("title")

        if current_user.role == UserRole.UNIVERSITY:
            doc["university_id"] = current_user.id
            doc["university_name"] = current_user.organization_name or current_user.name
        elif current_user.role == UserRole.INDUSTRY:
            doc["industry_id"] = current_user.id
            doc["industry_name"] = current_user.company_name or current_user.name

        # Process milestones
        milestones = []
        for i, m in enumerate(doc.get("milestones", [])):
            m_dict = m if isinstance(m, dict) else m.model_dump()
            m_dict["id"] = f"ms_{i+1}_{int(now.timestamp())}"
            if "status" not in m_dict:
                m_dict["status"] = MilestoneStatus.PENDING.value
            milestones.append(m_dict)
        doc["milestones"] = milestones

        # Calculate initial progress
        if milestones:
            completed_count = sum(1 for m in milestones if m.get("status") == MilestoneStatus.COMPLETED.value)
            doc["progress"] = round((completed_count / len(milestones)) * 100.0, 1)
        else:
            doc["progress"] = 0.0

        doc["status"] = ProjectStatus.ACTIVE.value
        doc["created_at"] = now
        doc["updated_at"] = now

        result = await projects_col.insert_one(doc)
        doc["_id"] = result.inserted_id

        # Update problem status to PROTOTYPING
        await problems_col.update_one(
            {"_id": prob_oid},
            {"$set": {"status": "PROTOTYPING", "updated_at": now}}
        )

        logger.info(f"Project '{payload.name}' created (ID: {result.inserted_id})")
        return cls._doc_to_response(doc)

    @classmethod
    async def list_projects(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        problem_id: Optional[str] = None,
        collaboration_id: Optional[str] = None,
        university_id: Optional[str] = None,
        industry_id: Optional[str] = None,
        status_filter: Optional[ProjectStatus] = None,
    ) -> ProjectListResponse:
        """
        Lists paginated projects with filters.
        """
        projects_col = db["projects"]
        query: Dict[str, Any] = {}

        if problem_id:
            query["problem_id"] = problem_id
        if collaboration_id:
            query["collaboration_id"] = collaboration_id
        if university_id:
            query["university_id"] = university_id
        if industry_id:
            query["industry_id"] = industry_id
        if status_filter:
            query["status"] = status_filter.value

        total = await projects_col.count_documents(query)
        skip = (page - 1) * limit

        cursor = projects_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
        items = []
        async for doc in cursor:
            items.append(cls._doc_to_response(doc))

        pages = max(1, (total + limit - 1) // limit)
        return ProjectListResponse(
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            projects=items
        )

    @classmethod
    async def get_project_by_id(
        cls,
        db: AsyncIOMotorDatabase,
        project_id: str
    ) -> ProjectResponse:
        """
        Fetches single project details.
        """
        projects_col = db["projects"]
        try:
            oid = ObjectId(project_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format.")

        doc = await projects_col.find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        return cls._doc_to_response(doc)

    @classmethod
    async def update_project(
        cls,
        db: AsyncIOMotorDatabase,
        project_id: str,
        current_user: UserProfileResponse,
        payload: ProjectUpdateRequest
    ) -> ProjectResponse:
        """
        Updates project details, documents, status, or progress.
        """
        projects_col = db["projects"]
        try:
            oid = ObjectId(project_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format.")

        existing = await projects_col.find_one({"_id": oid})
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        update_dict = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
        if "status" in update_dict and isinstance(update_dict["status"], ProjectStatus):
            update_dict["status"] = update_dict["status"].value

        update_dict["updated_at"] = datetime.utcnow()

        updated = await projects_col.find_one_and_update(
            {"_id": oid},
            {"$set": update_dict},
            return_document=True
        )
        return cls._doc_to_response(updated)

    @classmethod
    async def delete_project(
        cls,
        db: AsyncIOMotorDatabase,
        project_id: str,
        current_user: UserProfileResponse
    ) -> Dict[str, Any]:
        """
        Deletes a project record.
        """
        projects_col = db["projects"]
        try:
            oid = ObjectId(project_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format.")

        result = await projects_col.delete_one({"_id": oid})
        if result.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        return {"success": True, "message": f"Project {project_id} deleted successfully."}

    @classmethod
    async def add_milestone(
        cls,
        db: AsyncIOMotorDatabase,
        project_id: str,
        current_user: UserProfileResponse,
        payload: MilestoneCreateRequest
    ) -> ProjectResponse:
        """
        Appends a new milestone to an ongoing project.
        """
        projects_col = db["projects"]
        try:
            oid = ObjectId(project_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format.")

        existing = await projects_col.find_one({"_id": oid})
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        now = datetime.utcnow()
        new_ms = payload.model_dump()
        new_ms["id"] = f"ms_{len(existing.get('milestones', [])) + 1}_{int(now.timestamp())}"
        if "status" in new_ms and isinstance(new_ms["status"], MilestoneStatus):
            new_ms["status"] = new_ms["status"].value
        if new_ms.get("status") == MilestoneStatus.COMPLETED.value:
            new_ms["completed_at"] = now

        milestones = existing.get("milestones", [])
        milestones.append(new_ms)

        # Recalculate progress
        completed_count = sum(1 for m in milestones if m.get("status") == MilestoneStatus.COMPLETED.value)
        progress = round((completed_count / len(milestones)) * 100.0, 1)

        updated = await projects_col.find_one_and_update(
            {"_id": oid},
            {
                "$set": {
                    "milestones": milestones,
                    "progress": progress,
                    "updated_at": now
                }
            },
            return_document=True
        )
        return cls._doc_to_response(updated)
