from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class SearchResultItem(BaseModel):
    """
    Unified search item returned by global search engine.
    """
    id: str
    title: str
    type: str = Field(description="'problem', 'university', 'industry', 'solution', 'project'")
    category: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    snippet: str
    relevance_score: float = 1.0
    extra: Optional[Dict[str, Any]] = Field(default_factory=dict)


class GlobalSearchResponse(BaseModel):
    """
    Paginated global search response.
    """
    query: str
    total: int
    page: int
    limit: int
    pages: int
    results: List[SearchResultItem]
