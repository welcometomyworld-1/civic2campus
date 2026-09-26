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
from app.routes.squads import router as squads_router

__all__ = [
    "health_router",
    "auth_router",
    "problems_router",
    "ai_router",
    "matching_router",
    "collaborations_router",
    "projects_router",
    "solutions_router",
    "dashboard_router",
    "map_router",
    "notifications_router",
    "admin_router",
    "search_router",
    "squads_router",
]


