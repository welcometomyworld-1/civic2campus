import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.solution import SolutionStatus
from app.schemas.user import UserProfileResponse
from app.schemas.solution import (
    SolutionCreateRequest,
    SolutionUpdateRequest,
    SolutionResponse,
    SolutionListResponse,
)
from app.schemas.impact import (
    ImpactCreateRequest,
    ImpactResponse,
)

logger = logging.getLogger("civic2campus.solution_service")


class SolutionService:
    """
    Service managing field-tested civic solutions and real-world impact tracking.
    """

    @staticmethod
    def _solution_doc_to_response(doc: Dict[str, Any]) -> SolutionResponse:
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]

        return SolutionResponse(
            id=doc_copy["id"],
            problem_id=str(doc_copy["problem_id"]),
            problem_title=doc_copy.get("problem_title"),
            project_id=str(doc_copy["project_id"]),
            project_name=doc_copy.get("project_name"),
            title=doc_copy["title"],
            description=doc_copy["description"],
            solution_type=doc_copy.get("solution_type", "Hardware + IoT"),
            technology=doc_copy.get("technology", []),
            images=doc_copy.get("images", []),
            documents=doc_copy.get("documents", []),
            deployment_location=doc_copy.get("deployment_location"),
            latitude=doc_copy.get("latitude"),
            longitude=doc_copy.get("longitude"),
            deployment_date=doc_copy.get("deployment_date"),
            status=SolutionStatus(doc_copy.get("status", SolutionStatus.PROTOTYPE.value)),
            created_at=doc_copy.get("created_at", datetime.utcnow()),
            updated_at=doc_copy.get("updated_at", datetime.utcnow()),
        )

    @staticmethod
    def _impact_doc_to_response(doc: Dict[str, Any]) -> ImpactResponse:
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]

        return ImpactResponse(
            id=doc_copy["id"],
            solution_id=str(doc_copy["solution_id"]),
            problem_id=str(doc_copy.get("problem_id", "")),
            problem_title=doc_copy.get("problem_title"),
            people_benefited=int(doc_copy.get("people_benefited", 0)),
            area_covered=doc_copy.get("area_covered"),
            problem_resolved_percentage=float(doc_copy.get("problem_resolved_percentage", 100.0)),
            cost_saved=doc_copy.get("cost_saved"),
            time_saved=doc_copy.get("time_saved"),
            environmental_impact=doc_copy.get("environmental_impact"),
            education_impact=doc_copy.get("education_impact"),
            health_impact=doc_copy.get("health_impact"),
            deployment_date=doc_copy.get("deployment_date"),
            impact_description=doc_copy["impact_description"],
            created_at=doc_copy.get("created_at", datetime.utcnow()),
            updated_at=doc_copy.get("updated_at", datetime.utcnow()),
        )

    @classmethod
    async def create_solution(
        cls,
        db: AsyncIOMotorDatabase,
        current_user: UserProfileResponse,
        payload: SolutionCreateRequest
    ) -> SolutionResponse:
        """
        Registers a prototype or deployed solution for a community problem.
        """
        problems_col = db["problems"]
        projects_col = db["projects"]
        solutions_col = db["solutions"]

        try:
            prob_oid = ObjectId(payload.problem_id)
            proj_oid = ObjectId(payload.project_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem or project ID format.")

        problem = await problems_col.find_one({"_id": prob_oid})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        project = await projects_col.find_one({"_id": proj_oid})
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        now = datetime.utcnow()
        doc = payload.model_dump()
        doc["problem_title"] = problem.get("title")
        doc["project_name"] = project.get("name")
        if "status" in doc and isinstance(doc["status"], SolutionStatus):
            doc["status"] = doc["status"].value

        doc["created_at"] = now
        doc["updated_at"] = now

        result = await solutions_col.insert_one(doc)
        doc["_id"] = result.inserted_id

        # If deployed, progress problem status
        if doc.get("status") == SolutionStatus.DEPLOYED.value:
            await problems_col.update_one(
                {"_id": prob_oid},
                {"$set": {"status": "DEPLOYED", "updated_at": now}}
            )
            await projects_col.update_one(
                {"_id": proj_oid},
                {"$set": {"status": "DEPLOYED", "progress": 100.0, "updated_at": now}}
            )

        logger.info(f"Solution '{payload.title}' created (ID: {result.inserted_id})")
        return cls._solution_doc_to_response(doc)

    @classmethod
    async def list_solutions(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        problem_id: Optional[str] = None,
        project_id: Optional[str] = None,
        status_filter: Optional[SolutionStatus] = None,
    ) -> SolutionListResponse:
        """
        Lists solutions with multi-filter and pagination.
        """
        solutions_col = db["solutions"]
        query: Dict[str, Any] = {}

        if problem_id:
            query["problem_id"] = problem_id
        if project_id:
            query["project_id"] = project_id
        if status_filter:
            query["status"] = status_filter.value

        total = await solutions_col.count_documents(query)
        skip = (page - 1) * limit

        cursor = solutions_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
        items = []
        async for doc in cursor:
            items.append(cls._solution_doc_to_response(doc))

        pages = max(1, (total + limit - 1) // limit)
        return SolutionListResponse(
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            solutions=items
        )

    @classmethod
    async def get_solution_by_id(
        cls,
        db: AsyncIOMotorDatabase,
        solution_id: str
    ) -> SolutionResponse:
        """
        Fetches single solution details.
        """
        solutions_col = db["solutions"]
        try:
            oid = ObjectId(solution_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid solution ID format.")

        doc = await solutions_col.find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found.")

        return cls._solution_doc_to_response(doc)

    @classmethod
    async def update_solution(
        cls,
        db: AsyncIOMotorDatabase,
        solution_id: str,
        current_user: UserProfileResponse,
        payload: SolutionUpdateRequest
    ) -> SolutionResponse:
        """
        Updates solution details, field coordinates, or deployment status.
        """
        solutions_col = db["solutions"]
        problems_col = db["problems"]
        now = datetime.utcnow()

        try:
            oid = ObjectId(solution_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid solution ID format.")

        existing = await solutions_col.find_one({"_id": oid})
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found.")

        update_dict = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
        if "status" in update_dict and isinstance(update_dict["status"], SolutionStatus):
            update_dict["status"] = update_dict["status"].value

        update_dict["updated_at"] = now

        updated = await solutions_col.find_one_and_update(
            {"_id": oid},
            {"$set": update_dict},
            return_document=True
        )

        if updated.get("status") == SolutionStatus.DEPLOYED.value:
            try:
                prob_oid = ObjectId(existing["problem_id"])
                await problems_col.update_one(
                    {"_id": prob_oid},
                    {"$set": {"status": "DEPLOYED", "updated_at": now}}
                )
            except Exception:
                pass

        return cls._solution_doc_to_response(updated)

    @classmethod
    async def create_or_update_impact(
        cls,
        db: AsyncIOMotorDatabase,
        solution_id: str,
        current_user: UserProfileResponse,
        payload: ImpactCreateRequest
    ) -> ImpactResponse:
        """
        Submits or updates verified post-deployment impact metrics.
        """
        solutions_col = db["solutions"]
        impact_col = db["impact_metrics"]
        now = datetime.utcnow()

        try:
            sol_oid = ObjectId(solution_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid solution ID format.")

        solution = await solutions_col.find_one({"_id": sol_oid})
        if not solution:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found.")

        doc = payload.model_dump()
        doc["solution_id"] = solution_id
        doc["problem_id"] = str(solution.get("problem_id", ""))
        doc["problem_title"] = solution.get("problem_title")
        doc["updated_at"] = now

        upsert_res = await impact_col.find_one_and_update(
            {"solution_id": solution_id},
            {"$set": doc, "$setOnInsert": {"created_at": now}},
            upsert=True,
            return_document=True
        )

        logger.info(f"Impact metrics updated for Solution {solution_id}")
        return cls._impact_doc_to_response(upsert_res)

    @classmethod
    async def get_impact_by_solution_id(
        cls,
        db: AsyncIOMotorDatabase,
        solution_id: str
    ) -> ImpactResponse:
        """
        Retrieves impact metrics associated with a solution.
        """
        impact_col = db["impact_metrics"]
        doc = await impact_col.find_one({"solution_id": solution_id})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Impact metrics not found for this solution.")

        return cls._impact_doc_to_response(doc)
