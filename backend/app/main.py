import logging
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.config.settings import get_settings
from app.database.mongodb import MongoDBManager
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.problems import router as problems_router
from app.routes.ai import router as ai_router
from app.routes.matching import router as matching_router
from app.routes.collaborations import router as collaborations_router
from app.routes.projects import router as projects_router
from app.routes.solutions import router as solutions_router
from app.routes.dashboard import router as dashboard_router
from app.routes.map import router as map_router
from app.routes.notifications import router as notifications_router
from app.routes.admin import router as admin_router
from app.routes.search import router as search_router
from app.services.auth_service import AuthService
from app.services.matching_service import MatchingService

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s : %(message)s"
)
logger = logging.getLogger("civic2campus.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    FastAPI Lifespan Context Manager.
    Handles startup events (MongoDB connection, index initialization, admin seed, org seed, upload directory)
    and graceful shutdown (connection pool cleanup).
    """
    settings = get_settings()
    logger.info("==================================================")
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.APP_ENV}]")
    logger.info("==================================================")

    # 1. Ensure Upload Directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    logger.info(f"Upload directory verified: '{settings.UPLOAD_DIR}'")

    # 2. Establish MongoDB Connection & Build Indexes
    await MongoDBManager.connect_to_database()

    # 3. Seed Default Admin User, Verified Organizations, & Student Squads if not present
    if MongoDBManager.database is not None:
        try:
            await AuthService.seed_admin_user_if_needed(MongoDBManager.database)
            await MatchingService.seed_verified_organizations_if_needed(MongoDBManager.database)
            from app.services.squad_service import SquadService
            from app.services.university_hub_service import UniversityHubService
            from app.services.industry_hub_service import IndustryHubService
            await SquadService.seed_initial_squads_if_needed(MongoDBManager.database)
            await UniversityHubService.seed_university_hub_data_if_needed(MongoDBManager.database)
            await IndustryHubService.seed_industry_hub_data_if_needed(MongoDBManager.database)
        except Exception as exc:
            logger.warning(f"Seeding note (will retry on operations): {exc}")

    yield  # Application is live and serving requests

    # 4. Graceful Shutdown
    logger.info("Shutting down Civic2Campus API server...")
    await MongoDBManager.close_database_connection()
    logger.info("Civic2Campus backend shutdown complete.")


def create_application() -> FastAPI:
    """
    Application Factory creating and configuring the FastAPI instance.
    """
    settings = get_settings()

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
        swagger_ui_parameters={"persistAuthorization": True}
    )

    # Docs Aliases for /api/docs and /api/redoc
    @app.get("/api/docs", include_in_schema=False)
    async def docs_redirect():
        return RedirectResponse(url="/docs")

    @app.get("/api/redoc", include_in_schema=False)
    async def redoc_redirect():
        return RedirectResponse(url="/redoc")

    # -------------------------------------------------------------
    # CORS (Cross-Origin Resource Sharing) Configuration
    # -------------------------------------------------------------
    logger.info(f"Configuring CORS for origins: {settings.cors_origins}")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # -------------------------------------------------------------
    # Static Files (Uploads)
    # -------------------------------------------------------------
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

    # -------------------------------------------------------------
    # Global Exception Handlers
    # -------------------------------------------------------------
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error(f"Unhandled server error on {request.method} {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "Internal Server Error",
                "message": "An unexpected error occurred. Please try again later.",
                "path": request.url.path
            }
        )

    # -------------------------------------------------------------
    # Root Landing Endpoint
    # -------------------------------------------------------------
    @app.get("/", tags=["Root"])
    async def root_info():
        return {
            "app": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "online",
            "docs": "/api/docs",
            "health": "/api/health",
            "db_health": "/api/health/db",
            "endpoints": {
                "auth": "/api/auth",
                "problems": "/api/problems",
                "ai_analysis": "/api/ai",
                "university_matches": "/api/problems/{problem_id}/matches/universities",
                "industry_matches": "/api/problems/{problem_id}/matches/industries",
                "collaborations": "/api/collaborations",
                "projects": "/api/projects",
                "solutions": "/api/solutions",
                "dashboard": "/api/dashboard",
                "map": "/api/map",
                "notifications": "/api/notifications",
                "admin": "/api/admin",
                "search": "/api/search"
            }
        }

    # -------------------------------------------------------------
    # API Routers
    # -------------------------------------------------------------
    # All API routes are mounted under the /api prefix
    app.include_router(health_router, prefix="/api")
    app.include_router(auth_router, prefix="/api")
    app.include_router(problems_router, prefix="/api")
    app.include_router(ai_router, prefix="/api")
    app.include_router(matching_router, prefix="/api")
    app.include_router(collaborations_router, prefix="/api")
    app.include_router(projects_router, prefix="/api")
    app.include_router(solutions_router, prefix="/api")
    app.include_router(dashboard_router, prefix="/api")
    app.include_router(map_router, prefix="/api")
    app.include_router(notifications_router, prefix="/api")
    app.include_router(admin_router, prefix="/api")
    app.include_router(search_router, prefix="/api")
    from app.routes.squads import router as squads_router
    app.include_router(squads_router, prefix="/api")
    from app.routes.university_hubs import router as university_hubs_router
    app.include_router(university_hubs_router, prefix="/api")
    from app.routes.industry_hubs import router as industry_hubs_router
    app.include_router(industry_hubs_router, prefix="/api")

    return app


app = create_application()


