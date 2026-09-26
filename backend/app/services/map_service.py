import logging
from typing import Optional, List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.user import UserRole
from app.models.map_marker import MapMarker, MapMarkerType
from app.schemas.map import MapResponse
from app.services.matching_service import SEED_UNIVERSITIES, SEED_INDUSTRIES

logger = logging.getLogger("civic2campus.map_service")


class MapService:
    """
    Service querying MongoDB 2dsphere and bounding-box coordinates to build the
    Civic Innovation Map with real geo-coordinates.
    """

    @classmethod
    async def get_map_problems(
        cls,
        db: AsyncIOMotorDatabase,
        category: Optional[str] = None,
        status_filter: Optional[str] = None,
        district: Optional[str] = None,
        city: Optional[str] = None,
        limit: int = 100
    ) -> List[MapMarker]:
        """
        Retrieves problem map markers across Jharkhand.
        """
        problems_col = db["problems"]
        query: Dict[str, Any] = {}

        if category:
            query["category"] = category
        if status_filter:
            query["status"] = status_filter
        if district:
            query["location.district"] = district
        if city:
            query["location.city"] = city

        cursor = problems_col.find(query).limit(limit)
        markers = []

        async for p in cursor:
            loc = p.get("location", {})
            lat = loc.get("latitude", 23.3441)
            lng = loc.get("longitude", 85.3096)

            address_str = f"{loc.get('address', '')}, {loc.get('city', 'Ranchi')}, {loc.get('district', 'Jharkhand')}".strip(", ")
            summary = p.get("description", "")[:120] + ("..." if len(p.get("description", "")) > 120 else "")

            markers.append(
                MapMarker(
                    id=str(p["_id"]),
                    name=p.get("title", "Civic Problem"),
                    type=MapMarkerType.PROBLEM,
                    latitude=lat,
                    longitude=lng,
                    location=address_str or "Jharkhand",
                    status=p.get("status", "REPORTED"),
                    category=p.get("category", "General"),
                    summary=summary,
                    extra={
                        "urgency": p.get("urgency", "MEDIUM"),
                        "affected_people": p.get("affected_people"),
                        "district": loc.get("district")
                    }
                )
            )

        return markers

    @classmethod
    async def get_map_universities(
        cls,
        db: AsyncIOMotorDatabase,
        district: Optional[str] = None,
        city: Optional[str] = None,
        limit: int = 50
    ) -> List[MapMarker]:
        """
        Retrieves University R&D squad markers.
        """
        users_col = db["users"]
        univ_col = db["universities"]
        markers = []

        # 1. From database
        cursor = univ_col.find({}).limit(limit)
        async for u in cursor:
            markers.append(
                MapMarker(
                    id=str(u["_id"]),
                    name=u.get("organization_name", "University Squad"),
                    type=MapMarkerType.UNIVERSITY,
                    latitude=u.get("latitude", 23.4123),
                    longitude=u.get("longitude", 85.4399),
                    location=u.get("location", "Jharkhand"),
                    status=u.get("verification_status", "Approved"),
                    category="Academic R&D",
                    summary=f"Specialized in {', '.join(u.get('expertise', [])[:3])}",
                    extra={
                        "departments": u.get("departments", []),
                        "expertise": u.get("expertise", [])
                    }
                )
            )

        # Fallback to seeds if empty
        if not markers:
            for uni in SEED_UNIVERSITIES:
                markers.append(
                    MapMarker(
                        id=f"seed_univ_{uni['name'].replace(' ', '_')}",
                        name=uni["name"],
                        type=MapMarkerType.UNIVERSITY,
                        latitude=uni["latitude"],
                        longitude=uni["longitude"],
                        location=uni["location"],
                        status=uni["verification_status"],
                        category="Academic R&D",
                        summary=f"Specialized in {', '.join(uni.get('expertise', [])[:3])}",
                        extra={"expertise": uni["expertise"], "domains": uni["domains"]}
                    )
                )

        return markers

    @classmethod
    async def get_map_industries(
        cls,
        db: AsyncIOMotorDatabase,
        district: Optional[str] = None,
        city: Optional[str] = None,
        limit: int = 50
    ) -> List[MapMarker]:
        """
        Retrieves Industry CSR & sponsorship partner markers.
        """
        ind_col = db["industries"]
        markers = []

        cursor = ind_col.find({}).limit(limit)
        async for ind in cursor:
            markers.append(
                MapMarker(
                    id=str(ind["_id"]),
                    name=ind.get("company_name", "CSR Sponsor"),
                    type=MapMarkerType.INDUSTRY,
                    latitude=ind.get("latitude", 22.8046),
                    longitude=ind.get("longitude", 86.2029),
                    location=ind.get("location", "Jharkhand"),
                    status=ind.get("verification_status", "Approved"),
                    category=ind.get("industry_type", "Manufacturing & CSR"),
                    summary=f"Support available: {', '.join(ind.get('support_available', [])[:3])}",
                    extra={
                        "industry_type": ind.get("industry_type"),
                        "support_available": ind.get("support_available", [])
                    }
                )
            )

        # Fallback to seeds if empty
        if not markers:
            for ind in SEED_INDUSTRIES:
                markers.append(
                    MapMarker(
                        id=f"seed_ind_{ind['name'].replace(' ', '_')}",
                        name=ind["name"],
                        type=MapMarkerType.INDUSTRY,
                        latitude=ind["latitude"],
                        longitude=ind["longitude"],
                        location=ind["location"],
                        status=ind["verification_status"],
                        category=ind["industry_type"],
                        summary=f"Support available: {', '.join(ind.get('support_available', [])[:3])}",
                        extra={"support_available": ind["support_available"]}
                    )
                )

        return markers

    @classmethod
    async def get_map_solutions(
        cls,
        db: AsyncIOMotorDatabase,
        category: Optional[str] = None,
        status_filter: Optional[str] = None,
        limit: int = 50
    ) -> List[MapMarker]:
        """
        Retrieves deployed solutions and field prototype markers.
        """
        solutions_col = db["solutions"]
        query: Dict[str, Any] = {}
        if status_filter:
            query["status"] = status_filter

        cursor = solutions_col.find(query).limit(limit)
        markers = []

        async for s in cursor:
            lat = s.get("latitude", 23.3441)
            lng = s.get("longitude", 85.3096)
            summary = s.get("description", "")[:120]

            markers.append(
                MapMarker(
                    id=str(s["_id"]),
                    name=s.get("title", "Civic Solution"),
                    type=MapMarkerType.SOLUTION,
                    latitude=lat,
                    longitude=lng,
                    location=s.get("deployment_location") or "Jharkhand Field Site",
                    status=s.get("status", "DEPLOYED"),
                    category=s.get("solution_type", "Hardware + IoT"),
                    summary=summary,
                    extra={
                        "technology": s.get("technology", []),
                        "deployment_date": s.get("deployment_date")
                    }
                )
            )

        return markers

    @classmethod
    async def get_nearby_all(
        cls,
        db: AsyncIOMotorDatabase,
        latitude: float,
        longitude: float,
        radius_km: float = 50.0,
        marker_type: Optional[MapMarkerType] = None
    ) -> MapResponse:
        """
        Geospatial aggregation returning all problem, university, industry, and solution pins
        within radius_km from given GPS coordinate.
        """
        all_markers: List[MapMarker] = []

        if marker_type is None or marker_type == MapMarkerType.PROBLEM:
            problems = await cls.get_map_problems(db, limit=100)
            all_markers.extend(problems)

        if marker_type is None or marker_type == MapMarkerType.UNIVERSITY:
            universities = await cls.get_map_universities(db, limit=50)
            all_markers.extend(universities)

        if marker_type is None or marker_type == MapMarkerType.INDUSTRY:
            industries = await cls.get_map_industries(db, limit=50)
            all_markers.extend(industries)

        if marker_type is None or marker_type == MapMarkerType.SOLUTION:
            solutions = await cls.get_map_solutions(db, limit=50)
            all_markers.extend(solutions)

        # Filter by radius if distance calculation is needed
        # (Straight line distance check)
        from app.services.matching_service import MatchingEngine
        filtered = []
        for m in all_markers:
            dist = MatchingEngine._calculate_haversine_distance(latitude, longitude, m.latitude, m.longitude)
            if dist <= radius_km:
                m.extra["distance_km"] = round(dist, 1)
                filtered.append(m)

        filtered.sort(key=lambda x: x.extra.get("distance_km", 9999))

        return MapResponse(
            total=len(filtered),
            markers=filtered,
            center={"lat": latitude, "lng": longitude},
            zoom=10 if radius_km <= 50 else 8
        )
