from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CitizenDashboardResponse(BaseModel):
    """
    Personalized analytics and problem lifecycle tracker for logged-in Citizens.
    """
    problems_reported: int = Field(description="Total problems submitted by citizen")
    problems_under_analysis: int = Field(description="Problems currently undergoing AI analysis")
    active_problems: int = Field(description="Problems in matching, collaboration, or prototyping")
    deployed_solutions: int = Field(description="Problems resolved with deployed field solutions")
    recent_problems: List[Dict[str, Any]] = Field(default_factory=list)
    active_collaborations_count: int = 0


class UniversityDashboardResponse(BaseModel):
    """
    R&D, squad tracking, and civic innovation analytics for Universities.
    """
    matched_problems: int = Field(description="Total civic challenges matching university research capabilities")
    active_projects: int = Field(description="Ongoing prototype development projects")
    completed_projects: int = Field(description="Successfully finished student / lab projects")
    student_teams: int = Field(description="Total active student innovation squads")
    collaborations: int = Field(description="Active tripartite collaborations")
    solutions: int = Field(description="Total solutions deployed or field tested")
    recent_projects: List[Dict[str, Any]] = Field(default_factory=list)


class IndustryDashboardResponse(BaseModel):
    """
    CSR sponsorship, mentorship, and tech deployment metrics for Industry partners.
    """
    matched_opportunities: int = Field(description="CSR-aligned civic challenges recommended")
    active_collaborations: int = Field(description="Active co-development & CSR agreements")
    supported_projects: int = Field(description="Projects receiving hardware kits, mentorship, or co-funding")
    universities_connected: int = Field(description="Distinct academic institutions partnered with")
    solutions_supported: int = Field(description="Total field deployments backed by CSR")
    recent_initiatives: List[Dict[str, Any]] = Field(default_factory=list)


class GovernmentDashboardResponse(BaseModel):
    """
    State-wide civic problem resolution, district status, and governance metrics.
    """
    total_problems: int = Field(description="Total reported community issues across the state")
    high_priority_problems: int = Field(description="Urgent & Critical issues requiring immediate focus")
    matched_problems: int = Field(description="Issues successfully connected with university squads")
    active_projects: int = Field(description="Ongoing R&D & prototyping projects in field")
    deployed_solutions: int = Field(description="Total verified solutions implemented on ground")
    citizens_benefited: int = Field(description="Cumulative citizens positively impacted")
    universities: int = Field(description="Total participating academic institutions")
    industry_partners: int = Field(description="Total participating corporate & CSR sponsors")
    category_distribution: Dict[str, int] = Field(default_factory=dict)
    district_summary: List[Dict[str, Any]] = Field(default_factory=list)


class AdminDashboardResponse(BaseModel):
    """
    Comprehensive platform health, user distribution, and lifecycle metrics for Admins.
    """
    total_citizens: int
    total_universities: int
    total_industries: int
    total_government_users: int
    total_problems: int
    total_collaborations: int
    total_projects: int
    total_solutions: int
    total_citizens_benefited: int
    ai_analyses_completed: int
    system_status: str = "HEALTHY"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
