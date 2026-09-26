import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.db import get_db
from app.models.map_marker import MapMarker, MapMarkerType
from app.schemas.map import MapResponse
from app.services.map_service import MapService

logger = logging.getLogger("civic2campus.routes.map")

router = APIRouter(prefix="/map", tags=["Innovation Map"])


@router.get(
    "/problems",
    response_model=List[MapMarker],
    summary="Get Problem Markers for Innovation Map",
    description="Returns geo-coded community problem markers across Jharkhand districts with status and category filtering."
)
async def get_map_problems(
    category: Optional[str] = Query(None, description="Filter by problem category (e.g., Water, Roads)"),
    status: Optional[str] = Query(None, description="Filter by problem status (e.g., REPORTED, IN_PROGRESS)"),
    district: Optional[str] = Query(None, description="Filter by district (e.g., Ranchi, Dhanbad)"),
    city: Optional[str] = Query(None, description="Filter by city"),
    limit: int = Query(100, ge=1, le=500, description="Max pins to return"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[MapMarker]:
    return await MapService.get_map_problems(
        db=db,
        category=category,
        status_filter=status,
        district=district,
        city=city,
        limit=limit
    )


@router.get(
    "/universities",
    response_model=List[MapMarker],
    summary="Get University Squad Markers",
    description="Returns verified university and research institution locations with their primary R&D expertise domains."
)
async def get_map_universities(
    district: Optional[str] = Query(None, description="Filter by district"),
    city: Optional[str] = Query(None, description="Filter by city"),
    limit: int = Query(50, ge=1, le=200, description="Max university pins"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[MapMarker]:
    return await MapService.get_map_universities(
        db=db,
        district=district,
        city=city,
        limit=limit
    )


@router.get(
    "/industries",
    response_model=List[MapMarker],
    summary="Get Industry CSR & Sponsor Markers",
    description="Returns corporate CSR and manufacturing plant locations offering engineering sponsorship and equipment."
)
async def get_map_industries(
    district: Optional[str] = Query(None, description="Filter by district"),
    city: Optional[str] = Query(None, description="Filter by city"),
    limit: int = Query(50, ge=1, le=200, description="Max industry pins"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[MapMarker]:
    return await MapService.get_map_industries(
        db=db,
        district=district,
        city=city,
        limit=limit
    )


@router.get(
    "/solutions",
    response_model=List[MapMarker],
    summary="Get Deployed Solution & Prototype Markers",
    description="Returns locations of successfully deployed civic innovations, IoT monitors, and pilot prototypes."
)
async def get_map_solutions(
    category: Optional[str] = Query(None, description="Filter by solution category/domain"),
    status: Optional[str] = Query(None, description="Filter by status (e.g., DEPLOYED, PILOT)"),
    limit: int = Query(50, ge=1, le=200, description="Max solution pins"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[MapMarker]:
    return await MapService.get_map_solutions(
        db=db,
        category=category,
        status_filter=status,
        limit=limit
    )


@router.get(
    "/nearby",
    response_model=MapResponse,
    summary="Query Nearby Markers by Coordinates and Radius",
    description="Performs geospatial search around a latitude/longitude point within a given radius in kilometers."
)
async def get_nearby_markers(
    latitude: float = Query(23.3441, ge=-90.0, le=90.0, description="Center latitude coordinate"),
    longitude: float = Query(85.3096, ge=-180.0, le=180.0, description="Center longitude coordinate"),
    radius: float = Query(50.0, ge=1.0, le=500.0, description="Radius distance in kilometers"),
    type: Optional[MapMarkerType] = Query(None, description="Filter marker type (PROBLEM, UNIVERSITY, INDUSTRY, SOLUTION)"),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> MapResponse:
    return await MapService.get_nearby_all(
        db=db,
        latitude=latitude,
        longitude=longitude,
        radius_km=radius,
        marker_type=type
    )
