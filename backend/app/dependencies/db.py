from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import MongoDBManager


async def get_db() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency that provides an asynchronous MongoDB database instance.
    """
    return MongoDBManager.get_db()
