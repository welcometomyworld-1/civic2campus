import logging
import time
from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import pymongo
from app.config.settings import get_settings

logger = logging.getLogger("civic2campus.database")


class MongoDBManager:
    """
    Singleton manager for MongoDB connection lifecycle and client instance.
    Uses Motor for async non-blocking I/O.
    """
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

    @classmethod
    async def connect_to_database(cls) -> None:
        """
        Initializes MongoDB connection pool and verifies connectivity.
        """
        settings = get_settings()
        logger.info(f"Connecting to MongoDB at: {settings.MONGODB_URI} (DB: {settings.DB_NAME})")

        try:
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                minPoolSize=settings.DB_MIN_CONNECTIONS,
                maxPoolSize=settings.DB_MAX_CONNECTIONS,
                serverSelectionTimeoutMS=settings.DB_TIMEOUT_MS,
                connectTimeoutMS=settings.DB_TIMEOUT_MS,
                appname="civic2campus-backend"
            )
            cls.database = cls.client[settings.DB_NAME]

            # Fast ping check to verify connection upon startup
            await cls.client.admin.command('ping')
            logger.info("Successfully established connection to MongoDB.")

            # Create foundational indexes
            await cls.create_indexes()

        except Exception as exc:
            logger.error(f"Failed to connect to MongoDB: {exc}", exc_info=True)
            # We do not crash immediately so health checks can report database down state gracefully

    @classmethod
    async def close_database_connection(cls) -> None:
        """
        Gracefully closes MongoDB connection pool during application shutdown.
        """
        if cls.client:
            logger.info("Closing MongoDB connection pool...")
            cls.client.close()
            cls.client = None
            cls.database = None
            logger.info("MongoDB connection closed cleanly.")

    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        """
        Returns active database instance, recreating the client if the event loop changed.
        """
        import asyncio
        try:
            current_loop = asyncio.get_running_loop()
        except RuntimeError:
            current_loop = None

        if cls.client is not None and current_loop is not None:
            try:
                client_loop = cls.client.get_io_loop()
                if client_loop.is_closed() or client_loop != current_loop:
                    cls.client = None
                    cls.database = None
            except Exception:
                pass

        if cls.database is None or cls.client is None:
            settings = get_settings()
            cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
            cls.database = cls.client[settings.DB_NAME]
        return cls.database

    @classmethod
    async def check_health(cls) -> Dict[str, Any]:
        """
        Performs a database health check and ping latency measurement.
        """
        settings = get_settings()
        if cls.client is None:
            return {
                "status": "unhealthy",
                "connected": False,
                "error": "MongoDB client is not initialized",
                "database": settings.DB_NAME
            }

        try:
            start_time = time.perf_counter()
            ping_result = await cls.client.admin.command('ping')
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

            # Get server info
            server_info = await cls.client.server_info()
            version = server_info.get("version", "unknown")

            return {
                "status": "healthy",
                "connected": True,
                "latency_ms": latency_ms,
                "database": settings.DB_NAME,
                "server_version": version,
                "ping_ok": ping_result.get("ok") == 1.0
            }
        except Exception as exc:
            logger.warning(f"MongoDB health check failed: {exc}")
            return {
                "status": "unhealthy",
                "connected": False,
                "error": str(exc),
                "database": settings.DB_NAME
            }

    @classmethod
    async def create_indexes(cls) -> None:
        """
        Creates foundational indexes for collections when database is ready.
        """
        if cls.database is None:
            return

        try:
            # 1. Users Collection Indexes
            users_col = cls.database["users"]
            await users_col.create_index([("email", pymongo.ASCENDING)], unique=True, name="idx_users_email_unique")
            await users_col.create_index([("role", pymongo.ASCENDING)], name="idx_users_role")
            await users_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_users_created_at")

            # 2. Problems Collection Indexes
            problems_col = cls.database["problems"]
            await problems_col.create_index([("status", pymongo.ASCENDING)], name="idx_problems_status")
            await problems_col.create_index([("category", pymongo.ASCENDING)], name="idx_problems_category")
            await problems_col.create_index([("district", pymongo.ASCENDING)], name="idx_problems_district")
            await problems_col.create_index([("location.coordinates", pymongo.GEOSPHERE)], name="idx_problems_geo_2dsphere")
            await problems_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_problems_created_at")

            # 3. Projects Collection Indexes
            projects_col = cls.database["projects"]
            await projects_col.create_index([("problem_id", pymongo.ASCENDING)], name="idx_projects_problem_id")
            await projects_col.create_index([("collaboration_id", pymongo.ASCENDING)], name="idx_projects_collaboration_id")
            await projects_col.create_index([("university_id", pymongo.ASCENDING)], name="idx_projects_university_id")
            await projects_col.create_index([("industry_id", pymongo.ASCENDING)], name="idx_projects_industry_id")
            await projects_col.create_index([("status", pymongo.ASCENDING)], name="idx_projects_status")
            await projects_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_projects_created_at")

            # 4. Matches Collection Indexes (Step 5 Smart Matching)
            matches_col = cls.database["matches"]
            await matches_col.create_index([("problem_id", pymongo.ASCENDING), ("target_id", pymongo.ASCENDING)], unique=True, name="idx_matches_problem_target_unique")
            await matches_col.create_index([("problem_id", pymongo.ASCENDING)], name="idx_matches_problem_id")
            await matches_col.create_index([("target_id", pymongo.ASCENDING)], name="idx_matches_target_id")
            await matches_col.create_index([("target_type", pymongo.ASCENDING)], name="idx_matches_target_type")
            await matches_col.create_index([("score", pymongo.DESCENDING)], name="idx_matches_score_desc")
            await matches_col.create_index([("status", pymongo.ASCENDING)], name="idx_matches_status")

            # 5. Universities Collection Indexes
            univ_col = cls.database["universities"]
            await univ_col.create_index([("official_email", pymongo.ASCENDING)], unique=True, sparse=True, name="idx_univ_email_unique")
            await univ_col.create_index([("expertise", pymongo.ASCENDING)], name="idx_univ_expertise")
            await univ_col.create_index([("domains", pymongo.ASCENDING)], name="idx_univ_domains")
            await univ_col.create_index([("location_point", pymongo.GEOSPHERE)], name="idx_univ_geo_2dsphere")

            # 6. Industries Collection Indexes
            ind_col = cls.database["industries"]
            await ind_col.create_index([("official_email", pymongo.ASCENDING)], unique=True, sparse=True, name="idx_ind_email_unique")
            await ind_col.create_index([("industry_type", pymongo.ASCENDING)], name="idx_ind_type")
            await ind_col.create_index([("expertise", pymongo.ASCENDING)], name="idx_ind_expertise")
            await ind_col.create_index([("location_point", pymongo.GEOSPHERE)], name="idx_ind_geo_2dsphere")

            # 7. Collaborations Collection Indexes (Step 6)
            collab_col = cls.database["collaborations"]
            await collab_col.create_index([("problem_id", pymongo.ASCENDING)], name="idx_collab_problem_id")
            await collab_col.create_index([("university_id", pymongo.ASCENDING)], name="idx_collab_university_id")
            await collab_col.create_index([("industry_id", pymongo.ASCENDING)], name="idx_collab_industry_id")
            await collab_col.create_index([("citizen_id", pymongo.ASCENDING)], name="idx_collab_citizen_id")
            await collab_col.create_index([("status", pymongo.ASCENDING)], name="idx_collab_status")
            await collab_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_collab_created_at")

            # 8. Solutions Collection Indexes (Step 6)
            solutions_col = cls.database["solutions"]
            await solutions_col.create_index([("problem_id", pymongo.ASCENDING)], name="idx_solutions_problem_id")
            await solutions_col.create_index([("project_id", pymongo.ASCENDING)], name="idx_solutions_project_id")
            await solutions_col.create_index([("status", pymongo.ASCENDING)], name="idx_solutions_status")
            await solutions_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_solutions_created_at")

            # 9. Impact Metrics Collection Indexes (Step 6)
            impact_col = cls.database["impact_metrics"]
            await impact_col.create_index([("solution_id", pymongo.ASCENDING)], unique=True, name="idx_impact_solution_unique")
            await impact_col.create_index([("problem_id", pymongo.ASCENDING)], name="idx_impact_problem_id")
            await impact_col.create_index([("people_benefited", pymongo.DESCENDING)], name="idx_impact_people_desc")
            await impact_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_impact_created_at")

            # 10. Notifications Collection Indexes (Step 7)
            notifications_col = cls.database["notifications"]
            await notifications_col.create_index([("user_id", pymongo.ASCENDING), ("is_read", pymongo.ASCENDING)], name="idx_notifications_user_read")
            await notifications_col.create_index([("user_id", pymongo.ASCENDING), ("created_at", pymongo.DESCENDING)], name="idx_notifications_user_created")
            await notifications_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_notifications_created_at")

            # 11. Audit Logs Collection Indexes (Step 7)
            audit_col = cls.database["audit_logs"]
            await audit_col.create_index([("user_id", pymongo.ASCENDING)], name="idx_audit_user_id")
            await audit_col.create_index([("action", pymongo.ASCENDING)], name="idx_audit_action")
            await audit_col.create_index([("resource_type", pymongo.ASCENDING)], name="idx_audit_resource_type")
            await audit_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_audit_created_at")

            logger.info("Foundational MongoDB indexes (including Step 7 Notifications, Audit Logs, and Innovation Map collections) verified/created successfully.")
        except Exception as exc:
            logger.warning(f"Note on index creation (will retry on operations): {exc}")


async def get_database() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency-compatible helper to provide the async database handle.
    """
    return MongoDBManager.get_db()
