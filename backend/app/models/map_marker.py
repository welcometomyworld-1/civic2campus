from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class MapMarkerType(str, Enum):
    """
    Marker types supported on the Civic Innovation Map.
    """
    PROBLEM = "PROBLEM"
    UNIVERSITY = "UNIVERSITY"
    INDUSTRY = "INDUSTRY"
    SOLUTION = "SOLUTION"


class MapMarker(BaseModel):
    """
    Geospatial pin representing a localized entity on the Innovation Map.
    """
    id: str
    name: str = Field(description="Name or Title of entity (problem, university, company, solution)")
    type: MapMarkerType
    latitude: float
    longitude: float
    location: str = Field(description="Human readable address or city/district")
    status: Optional[str] = None
    category: Optional[str] = None
    summary: str = Field(description="Short 1-2 sentence description for map tooltip/popup")
    extra: Optional[Dict[str, Any]] = Field(default_factory=dict)
