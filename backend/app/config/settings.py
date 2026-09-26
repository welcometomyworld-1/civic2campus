import os
from functools import lru_cache
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings loaded from environment variables and .env file.
    Uses Pydantic v2 BaseSettings for strict type validation.
    """
    _env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    model_config = SettingsConfigDict(
        env_file=(_env_path, ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Project Info
    PROJECT_NAME: str = "Civic2Campus API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend REST API for Civic2Campus - AI-Powered Civic Innovation Ecosystem"
    APP_ENV: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # MongoDB Configuration
    MONGODB_URI: str = Field(
        default="mongodb://localhost:27017",
        description="MongoDB connection string URI"
    )
    DB_NAME: str = Field(
        default="civic2campus",
        description="MongoDB database name"
    )
    DB_MIN_CONNECTIONS: int = 10
    DB_MAX_CONNECTIONS: int = 50
    DB_TIMEOUT_MS: int = 5000

    # JWT Authentication Configuration
    JWT_SECRET: str = Field(
        default="civic2campus_development_jwt_secret_key_2026_super_secure_auth",
        description="Secret key for signing JWT tokens"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Initial Admin Seed Configuration
    ADMIN_EMAIL: str = "admin@jharkhand.gov.in"
    ADMIN_PASSWORD: str = "AdminSecure@2026"
    ADMIN_NAME: str = "State Innovation Administrator"

    # CORS & Frontend Origins
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # AI Integration
    AI_API_KEY: str = ""

    # File Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 25

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() == "production"

    @property
    def cors_origins(self) -> List[str]:
        origins = list(self.ALLOWED_ORIGINS)
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance to avoid re-reading environment variables on every call.
    """
    return Settings()
