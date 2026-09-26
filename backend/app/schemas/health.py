from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class AppHealthResponse(BaseModel):
    """
    Schema for application health check response.
    """
    status: str = Field(default="healthy", description="Overall application status")
    app_name: str = Field(description="Application project name")
    version: str = Field(description="Application version")
    environment: str = Field(description="Deployment environment")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC Timestamp of health check")
    uptime_seconds: Optional[float] = Field(default=None, description="Application uptime in seconds")


class DatabaseHealthResponse(BaseModel):
    """
    Schema for MongoDB health check response.
    """
    status: str = Field(description="Database connectivity status (healthy/unhealthy)")
    connected: bool = Field(description="Boolean connectivity flag")
    database: str = Field(description="Database name")
    latency_ms: Optional[float] = Field(default=None, description="Ping round-trip latency in milliseconds")
    server_version: Optional[str] = Field(default=None, description="MongoDB server version")
    ping_ok: Optional[bool] = Field(default=None, description="Ping command response flag")
    error: Optional[str] = Field(default=None, description="Error message if unhealthy")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC Timestamp")
