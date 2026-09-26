import logging
from typing import Optional
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.schemas.search import GlobalSearchResponse
from app.services.search_service import SearchService

logger = logging.getLogger("civic2campus.routes.search")

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get(
    "",
    response_model=GlobalSearchResponse,
    summary="Unified Global Search Engine",
    description="Unified multi-collection search querying across Problems, Universities, Industries, and Solutions."
)
async def global_search(
    q: str = Query("", description="Keyword search string"),
    category: Optional[str] = Query(None, description="Category filter"),
    location: Optional[str] = Query(None, description="City or district location filter"),
    status: Optional[str] = Query(None, description="Status filter"),
    type: Optional[str] = Query(None, description="Entity type filter ('problem', 'university', 'industry', 'solution')"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> GlobalSearchResponse:
    return await SearchService.global_search(
        db=db,
        query=q,
        category=category,
        location=location,
        status=status,
        target_type=type,
        page=page,
        limit=limit
    )
