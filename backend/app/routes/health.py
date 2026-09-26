import time
from fastapi import APIRouter, Response, status
from app.config.settings import get_settings
from app.database.mongodb import MongoDBManager
from app.schemas.health import AppHealthResponse, DatabaseHealthResponse

router = APIRouter(prefix="/health", tags=["Health Checks"])

# Record application start time
APP_START_TIME = time.time()


@router.get(
    "",
    response_model=AppHealthResponse,
    summary="Application Health Check",
    description="Returns general application status, version, and uptime."
)
async def get_app_health() -> AppHealthResponse:
    """
    Check if the FastAPI backend server is responsive.
    """
    settings = get_settings()
    uptime = round(time.time() - APP_START_TIME, 2)

    return AppHealthResponse(
        status="healthy",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.APP_ENV,
        uptime_seconds=uptime
    )


@router.get(
    "/db",
    response_model=DatabaseHealthResponse,
    summary="Database Connectivity Health Check",
    description="Pings MongoDB server and returns latency, connection status, and server version."
)
async def get_database_health(response: Response) -> DatabaseHealthResponse:
    """
    Check MongoDB database connection and measure ping latency.
    Returns HTTP 503 Service Unavailable if MongoDB is disconnected.
    """
    health_data = await MongoDBManager.check_health()

    if not health_data.get("connected", False):
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return DatabaseHealthResponse(
        status=health_data.get("status", "unhealthy"),
        connected=health_data.get("connected", False),
        database=health_data.get("database", "unknown"),
        latency_ms=health_data.get("latency_ms"),
        server_version=health_data.get("server_version"),
        ping_ok=health_data.get("ping_ok"),
        error=health_data.get("error")
    )
