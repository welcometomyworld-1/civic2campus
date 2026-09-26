import os
import math
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple
from bson import ObjectId
from fastapi import HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config.settings import get_settings
from app.models.user import UserRole
from app.models.problem import (
    ProblemCategory,
    UrgencyLevel,
    ProblemStatus,
    AIAnalysisStatus,
    ProblemDocument,
)
from app.schemas.user import UserProfileResponse
from app.schemas.problem import (
    ProblemCreateRequest,
    ProblemUpdateRequest,
    ProblemResponse,
    ProblemListResponse,
    EvidenceUploadResponse,
)

logger = logging.getLogger("civic2campus.problem_service")

# Allowed evidence file extensions & categories
ALLOWED_EXTENSIONS = {
    "image": [".jpg", ".jpeg", ".png", ".webp"],
    "pdf": [".pdf"],
    "video": [".mp4", ".mov", ".webm", ".avi"]
}
ALL_ALLOWED_EXTS = set(sum(ALLOWED_EXTENSIONS.values(), []))


class ProblemService:
    """
    Business logic for community problem reporting, geospatial querying, and evidence processing.
    """

    @staticmethod
    def _doc_to_problem_response(doc: Dict[str, Any], distance_km: Optional[float] = None) -> ProblemResponse:
        """
        Converts raw MongoDB document to standardized ProblemResponse DTO.
        """
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]

        if distance_km is not None:
            doc_copy["distance_km"] = round(distance_km, 2)

        return ProblemResponse(**doc_copy)

    @classmethod
    def _calculate_priority_score(cls, urgency: UrgencyLevel, affected_people: Optional[str]) -> int:
        """
        Calculates initial priority score (1-100) based on severity and population impact.
        """
        base_scores = {
            UrgencyLevel.CRITICAL: 85,
            UrgencyLevel.HIGH: 70,
            UrgencyLevel.MEDIUM: 50,
            UrgencyLevel.LOW: 30,
        }
        score = base_scores.get(urgency, 50)

        # Heuristic boost for large population affected
        if affected_people:
            aff_lower = affected_people.lower()
            if any(k in aff_lower for k in ["1000", "5000", "village", "ward", "entire", "all"]):
                score = min(100, score + 15)
            elif any(k in aff_lower for k in ["100", "500", "school", "hospital"]):
                score = min(100, score + 8)

        return score

    @classmethod
    async def create_problem(
        cls,
        db: AsyncIOMotorDatabase,
        current_user: UserProfileResponse,
        payload: ProblemCreateRequest
    ) -> ProblemResponse:
        """
        Saves a new community problem to MongoDB with 2dsphere GeoJSON geometry.
        """
        problems_col = db["problems"]
        now = datetime.utcnow()

        # 1. Construct GeoJSON Point for MongoDB 2dsphere Index
        geo_point = {
            "type": "Point",
            "coordinates": [payload.location.longitude, payload.location.latitude]
        }

        location_dict = payload.location.model_dump()
        location_dict["geo"] = geo_point

        # 2. Build Evidence dicts
        evidence_list = [ev.model_dump() for ev in payload.evidence]

        # 3. Build Reported By User summary
        reported_by_summary = {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role.value,
            "phone": current_user.phone
        }

        # 4. Calculate Priority Score
        priority_score = cls._calculate_priority_score(payload.urgency, payload.affected_people)

        # 5. Build Complete Problem Document
        problem_dict = {
            "title": payload.title.strip(),
            "description": payload.description.strip(),
            "category": payload.category.value,
            "sub_category": payload.sub_category.strip() if payload.sub_category else None,
            "affected_people": payload.affected_people.strip() if payload.affected_people else None,
            "affected_area": payload.affected_area.strip() if payload.affected_area else None,
            "frequency": payload.frequency,
            "urgency": payload.urgency.value,
            "location": location_dict,
            "evidence": evidence_list,
            "reported_by": reported_by_summary,
            "status": ProblemStatus.SUBMITTED.value,
            "ai_analysis_status": AIAnalysisStatus.PENDING.value,
            "priority_score": priority_score,
            "upvotes": 0,
            "upvoted_by": [],
            "reference_number": payload.reference_number,
            "created_at": now,
            "updated_at": now
        }

        # 6. Insert into MongoDB
        result = await problems_col.insert_one(problem_dict)
        problem_dict["_id"] = result.inserted_id

        logger.info(
            f"New problem reported by {current_user.email} (ID: {result.inserted_id}) - Category: {payload.category.value}"
        )
        return cls._doc_to_problem_response(problem_dict)

    @classmethod
    async def get_problem_by_id(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str
    ) -> ProblemResponse:
        """
        Fetches a single problem document by MongoDB ObjectId.
        """
        problems_col = db["problems"]
        try:
            obj_id = ObjectId(problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": obj_id})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Problem with ID '{problem_id}' not found.")

        return cls._doc_to_problem_response(problem)

    @classmethod
    async def list_problems(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        category: Optional[ProblemCategory] = None,
        status_filter: Optional[ProblemStatus] = None,
        urgency: Optional[UrgencyLevel] = None,
        district: Optional[str] = None,
        city: Optional[str] = None,
        search: Optional[str] = None
    ) -> ProblemListResponse:
        """
        Retrieves paginated problem list with multi-parameter filtering.
        """
        problems_col = db["problems"]
        query: Dict[str, Any] = {}

        if category:
            query["category"] = category.value
        if status_filter:
            query["status"] = status_filter.value
        if urgency:
            query["urgency"] = urgency.value
        if district:
            query["location.district"] = {"$regex": district.strip(), "$options": "i"}
        if city:
            query["location.city"] = {"$regex": city.strip(), "$options": "i"}
        if search:
            query["$or"] = [
                {"title": {"$regex": search.strip(), "$options": "i"}},
                {"description": {"$regex": search.strip(), "$options": "i"}},
                {"location.address": {"$regex": search.strip(), "$options": "i"}}
            ]

        total = await problems_col.count_documents(query)
        total_pages = max(1, math.ceil(total / limit))
        skip_count = (page - 1) * limit

        cursor = problems_col.find(query).sort("created_at", -1).skip(skip_count).limit(limit)
        items = []
        async for doc in cursor:
            items.append(cls._doc_to_problem_response(doc))

        return ProblemListResponse(
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            items=items
        )

    @classmethod
    async def get_nearby_problems(
        cls,
        db: AsyncIOMotorDatabase,
        latitude: float,
        longitude: float,
        radius_km: float = 25.0,
        category: Optional[ProblemCategory] = None,
        status_filter: Optional[ProblemStatus] = None,
        limit: int = 30
    ) -> List[ProblemResponse]:
        """
        Performs Geospatial $nearSphere query to find community problems within specified radius.
        """
        problems_col = db["problems"]
        max_distance_meters = radius_km * 1000

        geo_query: Dict[str, Any] = {
            "location.geo": {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "$maxDistance": max_distance_meters
                }
            }
        }

        if category:
            geo_query["category"] = category.value
        if status_filter:
            geo_query["status"] = status_filter.value

        items = []
        try:
            cursor = problems_col.find(geo_query).limit(limit)
            async for doc in cursor:
                # Calculate approximate straight line distance in KM
                coords = doc.get("location", {}).get("geo", {}).get("coordinates", [longitude, latitude])
                doc_lng, doc_lat = coords[0], coords[1]

                # Haversine distance
                dlat = math.radians(doc_lat - latitude)
                dlng = math.radians(doc_lng - longitude)
                a = math.sin(dlat / 2)**2 + math.cos(math.radians(latitude)) * math.cos(math.radians(doc_lat)) * math.sin(dlng / 2)**2
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                dist_km = 6371 * c

                items.append(cls._doc_to_problem_response(doc, distance_km=dist_km))
        except Exception as exc:
            logger.warning(f"Geospatial $nearSphere query failed, falling back to filter: {exc}")
            # Fallback if 2dsphere index is still building
            cursor = problems_col.find({}).sort("created_at", -1).limit(limit)
            async for doc in cursor:
                items.append(cls._doc_to_problem_response(doc))

        return items

    @classmethod
    async def get_my_problems(
        cls,
        db: AsyncIOMotorDatabase,
        current_user: UserProfileResponse,
        page: int = 1,
        limit: int = 20
    ) -> ProblemListResponse:
        """
        Returns problems reported by the currently authenticated user.
        """
        problems_col = db["problems"]
        query = {"reported_by.id": current_user.id}

        total = await problems_col.count_documents(query)
        total_pages = max(1, math.ceil(total / limit))
        skip_count = (page - 1) * limit

        cursor = problems_col.find(query).sort("created_at", -1).skip(skip_count).limit(limit)
        items = []
        async for doc in cursor:
            items.append(cls._doc_to_problem_response(doc))

        return ProblemListResponse(
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            items=items
        )

    @classmethod
    async def get_high_priority_problems(
        cls,
        db: AsyncIOMotorDatabase,
        limit: int = 10
    ) -> List[ProblemResponse]:
        """
        Returns most critical and high urgency problems awaiting university R&D solutions.
        """
        problems_col = db["problems"]
        query = {
            "urgency": {"$in": [UrgencyLevel.CRITICAL.value, UrgencyLevel.HIGH.value]},
            "status": {"$ne": ProblemStatus.CLOSED.value}
        }
        cursor = problems_col.find(query).sort("priority_score", -1).limit(limit)
        items = []
        async for doc in cursor:
            items.append(cls._doc_to_problem_response(doc))
        return items

    @classmethod
    async def get_problems_by_category(
        cls,
        db: AsyncIOMotorDatabase,
        category: str,
        page: int = 1,
        limit: int = 20
    ) -> ProblemListResponse:
        """
        Filters problems belonging to a specific domain category.
        """
        problems_col = db["problems"]
        query = {"category": {"$regex": f"^{category.strip()}$", "$options": "i"}}

        total = await problems_col.count_documents(query)
        total_pages = max(1, math.ceil(total / limit))
        skip_count = (page - 1) * limit

        cursor = problems_col.find(query).sort("created_at", -1).skip(skip_count).limit(limit)
        items = []
        async for doc in cursor:
            items.append(cls._doc_to_problem_response(doc))

        return ProblemListResponse(
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            items=items
        )

    @classmethod
    async def update_problem(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str,
        current_user: UserProfileResponse,
        update_data: ProblemUpdateRequest
    ) -> ProblemResponse:
        """
        Updates an existing problem document. Enforces ownership or Admin/Government access.
        """
        problems_col = db["problems"]
        try:
            obj_id = ObjectId(problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": obj_id})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        # Check permissions: Author, Admin, or Government
        is_author = problem.get("reported_by", {}).get("id") == current_user.id
        is_admin_or_gov = current_user.role in [UserRole.ADMIN, UserRole.GOVERNMENT]

        if not (is_author or is_admin_or_gov):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this problem report."
            )

        update_dict: Dict[str, Any] = {"updated_at": datetime.utcnow()}

        if update_data.title is not None:
            update_dict["title"] = update_data.title.strip()
        if update_data.description is not None:
            update_dict["description"] = update_data.description.strip()
        if update_data.category is not None:
            update_dict["category"] = update_data.category.value
        if update_data.sub_category is not None:
            update_dict["sub_category"] = update_data.sub_category.strip()
        if update_data.urgency is not None:
            update_dict["urgency"] = update_data.urgency.value
            update_dict["priority_score"] = cls._calculate_priority_score(
                update_data.urgency, problem.get("affected_people")
            )
        if update_data.status is not None:
            update_dict["status"] = update_data.status.value
        if update_data.affected_people is not None:
            update_dict["affected_people"] = update_data.affected_people.strip()
        if update_data.affected_area is not None:
            update_dict["affected_area"] = update_data.affected_area.strip()
        if update_data.frequency is not None:
            update_dict["frequency"] = update_data.frequency.strip()
        if update_data.evidence is not None:
            update_dict["evidence"] = [ev.model_dump() for ev in update_data.evidence]
        if update_data.location is not None:
            loc_dump = update_data.location.model_dump()
            loc_dump["geo"] = {
                "type": "Point",
                "coordinates": [update_data.location.longitude, update_data.location.latitude]
            }
            update_dict["location"] = loc_dump

        result = await problems_col.find_one_and_update(
            {"_id": obj_id},
            {"$set": update_dict},
            return_document=True
        )

        logger.info(f"Problem {problem_id} updated by {current_user.email}")
        return cls._doc_to_problem_response(result)

    @classmethod
    async def delete_problem(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str,
        current_user: UserProfileResponse
    ) -> Dict[str, Any]:
        """
        Deletes a problem report. Enforces author ownership or Admin role.
        """
        problems_col = db["problems"]
        try:
            obj_id = ObjectId(problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": obj_id})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        is_author = problem.get("reported_by", {}).get("id") == current_user.id
        is_admin = current_user.role == UserRole.ADMIN

        if not (is_author or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the author or platform Administrator can delete this problem report."
            )

        await problems_col.delete_one({"_id": obj_id})
        logger.info(f"Problem {problem_id} deleted by {current_user.email}")
        return {
            "success": True,
            "message": f"Problem report with ID '{problem_id}' deleted successfully."
        }

    @classmethod
    async def save_evidence_file(
        cls,
        file: UploadFile
    ) -> EvidenceUploadResponse:
        """
        Securely validates and stores uploaded media files (images, PDFs, videos) on local storage.
        """
        settings = get_settings()
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

        if not file.filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File name cannot be empty.")

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALL_ALLOWED_EXTS:
            allowed_str = ", ".join(ALL_ALLOWED_EXTS)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file extension '{ext}'. Allowed: {allowed_str}"
            )

        # Determine file type
        file_type = "image"
        if ext in ALLOWED_EXTENSIONS["pdf"]:
            file_type = "pdf"
        elif ext in ALLOWED_EXTENSIONS["video"]:
            file_type = "video"

        # Read content and enforce max size
        content = await file.read()
        size_bytes = len(content)
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

        if size_bytes > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum upload size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        # Generate unique, collision-proof filename
        timestamp_prefix = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        unique_suffix = uuid.uuid4().hex[:8]
        safe_filename = f"evidence_{timestamp_prefix}_{unique_suffix}{ext}"
        destination_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

        with open(destination_path, "wb") as f:
            f.write(content)

        file_url = f"/uploads/{safe_filename}"
        logger.info(f"Saved evidence file: {safe_filename} ({size_bytes} bytes, Type: {file_type})")

        return EvidenceUploadResponse(
            file_name=file.filename,
            file_url=file_url,
            file_type=file_type,
            file_size_bytes=size_bytes,
            content_type=file.content_type or "application/octet-stream"
        )
