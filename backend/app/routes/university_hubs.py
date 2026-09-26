import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.dependencies.auth import get_optional_current_user, get_current_user
from app.models.user import UserRole
from app.schemas.user import UserProfileResponse
from app.services.university_hub_service import UniversityHubService

logger = logging.getLogger("civic2campus.routes.university_hubs")

router = APIRouter(prefix="/university", tags=["University Dashboard Hubs"])


def _get_fallback_university(current_user: Optional[UserProfileResponse]) -> UserProfileResponse:
    if current_user:
        return current_user
    return UserProfileResponse(
        id="seed_bit_mesra",
        name="Birla Institute of Technology, Mesra",
        email="innovator@bitmesra.ac.in",
        role=UserRole.UNIVERSITY,
        status="ACTIVE",
        is_verified=True,
        created_at="2026-09-17T02:00:00Z",
        updated_at="2026-09-17T02:00:00Z"
    )


# -----------------------------------------------------------------------------
# 1. INDUSTRY & CSR PARTNERS HUB
# -----------------------------------------------------------------------------
@router.get("/industry-partners", summary="List Industry & CSR Partners")
async def list_industry_partners(
    search: Optional[str] = Query(None),
    industry_type: Optional[str] = Query(None),
    support_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await UniversityHubService.list_industry_partners(
        db=db,
        search=search,
        industry_type=industry_type,
        support_type=support_type,
        location=location,
        limit=limit,
        skip=skip
    )


@router.get("/industry-partners/{industry_id}", summary="Get Industry Partner Details")
async def get_industry_partner(
    industry_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await UniversityHubService.get_industry_partner_by_id(db, industry_id)


@router.post("/industry-partners/{industry_id}/request", summary="Request Industry Collaboration")
async def request_industry_collaboration(
    industry_id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.request_industry_collaboration(db, user, industry_id, payload)


# -----------------------------------------------------------------------------
# 2. ACTIVE COLLABORATIONS HUB
# -----------------------------------------------------------------------------
@router.get("/collaborations", summary="List University Active Collaborations")
async def list_collaborations(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.list_university_collaborations(
        db=db,
        current_user=user,
        status_filter=status,
        search=search,
        industry_name=industry,
        limit=limit,
        skip=skip
    )


@router.get("/collaborations/{id}", summary="Get Collaboration Details by ID")
async def get_collaboration_by_id(
    id: str,
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.get_university_collaboration_by_id(db, user, id)


@router.put("/collaborations/{id}", summary="Update Collaboration Details")
async def update_collaboration(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.update_university_collaboration(db, user, id, payload)


@router.post("/collaborations/{id}/milestones", summary="Add Milestone to Collaboration")
async def add_milestone(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.add_collaboration_milestone(db, user, id, payload)


@router.post("/collaborations/{id}/tasks", summary="Add Task to Collaboration")
async def add_task(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.add_collaboration_task(db, user, id, payload)


@router.get("/collaborations/{id}/activity", summary="Get Collaboration Activity Stream")
async def get_collaboration_activity(
    id: str,
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    collab = await UniversityHubService.get_university_collaboration_by_id(db, user, id)
    return {"items": collab.get("activity_timeline", [])}


# -----------------------------------------------------------------------------
# 3. SOLUTIONS HUB
# -----------------------------------------------------------------------------
@router.get("/solutions", summary="List University Solutions & Prototypes")
async def list_solutions(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.list_university_solutions(
        db=db,
        current_user=user,
        status_filter=status,
        category=category,
        search=search,
        limit=limit,
        skip=skip
    )


@router.get("/solutions/{id}", summary="Get Solution Details")
async def get_solution(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await UniversityHubService.get_university_solution_by_id(db, id)


@router.post("/solutions", summary="Create Solution / Prototype")
async def create_solution(
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.create_university_solution(db, user, payload)


@router.put("/solutions/{id}", summary="Update Solution")
async def update_solution(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    solutions_col = db["solutions"]
    from bson import ObjectId
    try:
        query = {"_id": ObjectId(id)}
    except Exception:
        query = {"id": id}
    updated = await solutions_col.find_one_and_update(query, {"$set": payload}, return_document=True)
    if not updated:
        raise HTTPException(status_code=404, detail="Solution not found")
    updated["id"] = str(updated.get("_id", id))
    return updated


@router.put("/solutions/{id}/status", summary="Update Solution Status")
async def update_solution_status(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    new_status = payload.get("status", "DEPLOYED")
    return await UniversityHubService.update_university_solution_status(db, user, id, new_status)


@router.post("/solutions/{id}/testing", summary="Add Testing Record")
async def add_solution_testing(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.add_solution_testing_record(db, user, id, payload)


@router.post("/solutions/{id}/deployment", summary="Add Deployment Record")
async def add_solution_deployment(
    id: str,
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    solutions_col = db["solutions"]
    from bson import ObjectId
    try:
        query = {"_id": ObjectId(id)}
    except Exception:
        query = {"id": id}
    deployment_info = {
        "deployment_location": payload.get("location", "Jharkhand"),
        "deployment_date": payload.get("date", "2026-10-15"),
        "status": "DEPLOYED",
        "people_benefited": payload.get("people_benefited", 5000)
    }
    updated = await solutions_col.find_one_and_update(query, {"$set": deployment_info}, return_document=True)
    if not updated:
        raise HTTPException(status_code=404, detail="Solution not found")
    updated["id"] = str(updated.get("_id", id))
    return updated


# -----------------------------------------------------------------------------
# 4. IMPACT HUB
# -----------------------------------------------------------------------------
@router.get("/impact/summary", summary="Get University Impact Summary KPIs")
async def get_impact_summary(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.get_university_impact_summary(db, user)


@router.get("/impact/projects", summary="Get Impact Projects Distribution")
async def get_impact_projects(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await UniversityHubService.get_university_impact_projects(db)


@router.get("/impact/solutions", summary="Get Impact Solutions Distribution")
async def get_impact_solutions(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await UniversityHubService.get_university_impact_solutions(db)


@router.get("/impact/locations", summary="Get Deployments by District")
async def get_impact_locations(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await UniversityHubService.get_university_impact_locations(db)


@router.get("/impact/timeline", summary="Get Impact Growth Timeline")
async def get_impact_timeline(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await UniversityHubService.get_university_impact_timeline(db)


# -----------------------------------------------------------------------------
# 5. UNIVERSITY NOTIFICATIONS
# -----------------------------------------------------------------------------
@router.get("/notifications", summary="Get University Notifications")
async def get_university_notifications(
    unread_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    notif_col = db["notifications"]
    query = {"$or": [{"university_id": str(user.id)}, {"user_id": str(user.id)}, {"university_id": "seed_bit_mesra"}]}
    if unread_only:
        query["is_read"] = False

    cursor = notif_col.find(query).sort("created_at", -1).limit(limit)
    items = []
    async for doc in cursor:
        items.append({
            "id": str(doc.get("_id", "")),
            "type": doc.get("type", "progress"),
            "title": doc.get("title"),
            "message": doc.get("message"),
            "related_id": doc.get("related_id"),
            "related_type": doc.get("related_type"),
            "is_read": doc.get("is_read", False),
            "created_at": doc.get("created_at")
        })
    return {"items": items, "unread_count": len([i for i in items if not i["is_read"]])}


@router.get("/notifications/unread", summary="Get Unread Notification Count")
async def get_unread_count(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    notif_col = db["notifications"]
    query = {
        "$or": [{"university_id": str(user.id)}, {"user_id": str(user.id)}, {"university_id": "seed_bit_mesra"}],
        "is_read": False
    }
    count = await notif_col.count_documents(query)
    return {"unread_count": count}


@router.put("/notifications/{id}/read", summary="Mark Notification as Read")
async def mark_notif_read(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    notif_col = db["notifications"]
    from bson import ObjectId
    try:
        query = {"_id": ObjectId(id)}
    except Exception:
        query = {"id": id}
    await notif_col.update_one(query, {"$set": {"is_read": True}})
    return {"success": True, "id": id}


@router.put("/notifications/read-all", summary="Mark All Notifications as Read")
async def mark_all_read(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    notif_col = db["notifications"]
    query = {"$or": [{"university_id": str(user.id)}, {"user_id": str(user.id)}, {"university_id": "seed_bit_mesra"}]}
    res = await notif_col.update_many(query, {"$set": {"is_read": True}})
    return {"success": True, "modified_count": res.modified_count}


# -----------------------------------------------------------------------------
# 6. UNIVERSITY PROFILE
# -----------------------------------------------------------------------------
@router.get("/profile", summary="Get University Profile")
async def get_profile(
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.get_university_profile(db, user)


@router.put("/profile", summary="Update University Profile")
async def update_profile(
    payload: Dict[str, Any],
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    return await UniversityHubService.update_university_profile(db, user, payload)


@router.post("/profile/logo", summary="Upload University Logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: Optional[UserProfileResponse] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = _get_fallback_university(current_user)
    import os, uuid
    os.makedirs("uploads/logos", exist_ok=True)
    filename = f"logo_{uuid.uuid4().hex[:8]}_{file.filename}"
    filepath = os.path.join("uploads/logos", filename)
    with open(filepath, "wb") as f:
        f.write(await file.read())
    logo_url = f"/uploads/logos/{filename}"
    await UniversityHubService.update_university_profile(db, user, {"university_logo": logo_url})
    return {"success": True, "logo_url": logo_url}
