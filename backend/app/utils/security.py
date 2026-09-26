import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Union
import bcrypt
import jwt
from app.config.settings import get_settings

logger = logging.getLogger("civic2campus.security")

# Set of invalidated / blacklisted tokens (e.g. on logout)
# Can be expanded to MongoDB or Redis in enterprise deployments
INVALIDATED_TOKENS: set = set()


def hash_password(password: str) -> str:
    """
    Hashes a plain-text password securely using bcrypt.
    """
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a bcrypt hash.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception as exc:
        logger.error(f"Error during password verification: {exc}")
        return False


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generates a signed JWT Access Token containing user claims.
    """
    settings = get_settings()
    to_encode = data.copy()

    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "iat": now,
        "type": "access"
    })

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generates a signed JWT Refresh Token with longer expiration.
    """
    settings = get_settings()
    to_encode = data.copy()

    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode.update({
        "exp": expire,
        "iat": now,
        "type": "refresh"
    })

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def create_password_reset_token(email: str) -> str:
    """
    Generates a temporary token for password reset (15 minute validity).
    """
    settings = get_settings()
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=15)

    to_encode = {
        "sub": email,
        "type": "password_reset",
        "exp": expire,
        "iat": now
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JWT token. Returns payload dict or None if invalid/expired.
    """
    if is_token_blacklisted(token):
        logger.warning("Attempt to use blacklisted / logged out token")
        return None

    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        return None
    except jwt.InvalidTokenError as exc:
        logger.warning(f"Invalid JWT token: {exc}")
        return None


def invalidate_token(token: str) -> None:
    """
    Adds token to the blacklist upon logout.
    """
    INVALIDATED_TOKENS.add(token)


def is_token_blacklisted(token: str) -> bool:
    """
    Checks if token has been invalidated.
    """
    return token in INVALIDATED_TOKENS
