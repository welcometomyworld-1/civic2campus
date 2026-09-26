from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.map_marker import MapMarker, MapMarkerType


class MapResponse(BaseModel):
    """
    Standardized payload for Innovation Map view.
    """
    total: int
    markers: List[MapMarker]
    center: Optional[Dict[str, float]] = Field(default_factory=lambda: {"lat": 23.3441, "lng": 85.3096})  # Ranchi centroid
    zoom: int = 8
