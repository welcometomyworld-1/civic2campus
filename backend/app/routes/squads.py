import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database
from app.services.squad_service import SquadService

logger = logging.getLogger("civic2campus.routes.squads")

router = APIRouter(prefix="/university/squads", tags=["University - Student Engineering Squads"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_squad(
    payload: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Creates a new Student Engineering Squad with auto-generated ID (SE-001, SE-002, etc.).
    """
    try:
        squad = await SquadService.create_squad(db, payload)
        return {
            "success": True,
            "message": f"Squad '{squad.get('name')}' created successfully with ID {squad.get('squad_id')}.",
            "data": squad
        }
    except Exception as exc:
        logger.error(f"Error creating squad: {exc}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.get("")
async def list_squads(
    search: Optional[str] = Query(None, description="Search by name, ID, problem, leader, member, or tech"),
    status: Optional[str] = Query("ALL", description="Filter by status: ACTIVE, ON_HOLD, COMPLETED, DISBANDED"),
    department: Optional[str] = Query("ALL", description="Filter by department"),
    mentor: Optional[str] = Query("ALL", description="Filter by mentor name"),
    industry: Optional[str] = Query("ALL", description="Filter by industry partner"),
    current_phase: Optional[str] = Query("ALL", description="Filter by phase"),
    sort_by: Optional[str] = Query("updated_at", description="Sort field: updated_at, progress, name, squad_id, target_date"),
    sort_order: int = Query(-1, description="-1 for descending, 1 for ascending"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Lists squads with rich search, multi-field filtering, and sorting.
    """
    result = await SquadService.list_squads(
        db,
        search=search,
        status=status,
        department=department,
        mentor=mentor,
        industry=industry,
        current_phase=current_phase,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=limit
    )
    return {
        "success": True,
        "data": result
    }


@router.get("/summary")
async def get_squad_summary_kpis(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Fetches real-time summary KPIs for the University Dashboard.
    """
    summary = await SquadService.get_summary_kpis(db)
    return {
        "success": True,
        "data": summary
    }


@router.get("/{squad_id}")
async def get_squad_detail(
    squad_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Fetches full squad detail by squad_id (e.g. SE-001) or ObjectId.
    """
    squad = await SquadService.get_squad_by_id(db, squad_id)
    if not squad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "data": squad
    }


@router.put("/{squad_id}")
async def update_squad(
    squad_id: str,
    payload: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Updates squad details and records timeline changes.
    """
    updated = await SquadService.update_squad(db, squad_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": f"Squad '{squad_id}' updated successfully.",
        "data": updated
    }


@router.delete("/{squad_id}")
async def delete_squad(
    squad_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Deletes a squad safely.
    """
    deleted = await SquadService.delete_squad(db, squad_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": f"Squad '{squad_id}' deleted successfully."
    }


# =========================================================================
# SQUAD MEMBERS ENDPOINTS
# =========================================================================

@router.post("/{squad_id}/members")
async def add_squad_member(
    squad_id: str,
    member: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Adds a student member to the squad roster.
    """
    try:
        updated = await SquadService.add_member(db, squad_id, member)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
        return {
            "success": True,
            "message": f"Student '{member.get('name')}' added to squad.",
            "data": updated
        }
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))


@router.put("/{squad_id}/members/{student_id}")
async def update_squad_member(
    squad_id: str,
    student_id: str,
    update_data: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Updates student member role, task, or information.
    """
    updated = await SquadService.update_member(db, squad_id, student_id, update_data)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student '{student_id}' or Squad not found.")
    return {
        "success": True,
        "message": f"Member '{student_id}' updated successfully.",
        "data": updated
    }


@router.delete("/{squad_id}/members/{student_id}")
async def remove_squad_member(
    squad_id: str,
    student_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Removes a student member from the squad.
    """
    updated = await SquadService.remove_member(db, squad_id, student_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": f"Member '{student_id}' removed from squad.",
        "data": updated
    }


# =========================================================================
# MILESTONES ENDPOINTS
# =========================================================================

@router.post("/{squad_id}/milestones")
async def add_squad_milestone(
    squad_id: str,
    milestone: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Creates a new milestone for the squad.
    """
    updated = await SquadService.add_milestone(db, squad_id, milestone)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Milestone added.",
        "data": updated
    }


@router.put("/{squad_id}/milestones/{milestone_id}")
async def update_squad_milestone(
    squad_id: str,
    milestone_id: str,
    milestone_update: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Updates milestone progress, status, or completion.
    """
    updated = await SquadService.update_milestone(db, squad_id, milestone_id, milestone_update)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Milestone updated.",
        "data": updated
    }


# =========================================================================
# TASKS ENDPOINTS
# =========================================================================

@router.post("/{squad_id}/tasks")
async def add_squad_task(
    squad_id: str,
    task: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Creates a task assigned to a squad student member.
    """
    updated = await SquadService.add_task(db, squad_id, task)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Task assigned.",
        "data": updated
    }


@router.put("/{squad_id}/tasks/{task_id}")
async def update_squad_task(
    squad_id: str,
    task_id: str,
    task_update: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Updates task priority, status, or assignee.
    """
    updated = await SquadService.update_task(db, squad_id, task_id, task_update)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Task updated.",
        "data": updated
    }


# =========================================================================
# FIELD TESTING ENDPOINTS
# =========================================================================

@router.post("/{squad_id}/field-tests")
async def add_field_test(
    squad_id: str,
    field_test: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Records a field trial or testing log.
    """
    updated = await SquadService.add_field_test(db, squad_id, field_test)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Field test record added.",
        "data": updated
    }


@router.get("/{squad_id}/field-tests")
async def list_field_tests(
    squad_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Lists all field trials conducted by the squad.
    """
    squad = await SquadService.get_squad_by_id(db, squad_id)
    if not squad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "data": squad.get("field_testing", [])
    }


# =========================================================================
# DOCUMENTS ENDPOINTS
# =========================================================================

@router.post("/{squad_id}/documents")
async def add_document(
    squad_id: str,
    doc_payload: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Uploads or records a project design/research document.
    """
    updated = await SquadService.add_document(db, squad_id, doc_payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Document added.",
        "data": updated
    }


@router.get("/{squad_id}/documents")
async def list_documents(
    squad_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Lists all documents belonging to the squad.
    """
    squad = await SquadService.get_squad_by_id(db, squad_id)
    if not squad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "data": squad.get("documents", [])
    }


@router.delete("/{squad_id}/documents/{document_id}")
async def delete_document(
    squad_id: str,
    document_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Deletes a squad document.
    """
    updated = await SquadService.delete_document(db, squad_id, document_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Document deleted.",
        "data": updated
    }


# =========================================================================
# PROGRESS & IMPACT ENDPOINTS
# =========================================================================

@router.put("/{squad_id}/progress")
async def update_progress(
    squad_id: str,
    payload: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Updates phase and overall progress percentage with audit timeline entry.
    """
    updated = await SquadService.update_squad(db, squad_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Squad progress updated.",
        "data": updated
    }


@router.post("/{squad_id}/impact")
async def update_impact(
    squad_id: str,
    impact_data: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Updates post-deployment community impact metrics.
    """
    updated = await SquadService.update_squad(db, squad_id, {"impact": impact_data})
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "message": "Impact metrics updated.",
        "data": updated
    }


@router.get("/{squad_id}/impact")
async def get_impact(
    squad_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Fetches squad impact metrics.
    """
    squad = await SquadService.get_squad_by_id(db, squad_id)
    if not squad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Squad '{squad_id}' not found.")
    return {
        "success": True,
        "data": squad.get("impact", {})
    }
