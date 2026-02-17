"""Authentication service for JWT verification

Phase III: Compatible with string user_id type per constitution.
JWT tokens use string user_id in 'sub' claim.
"""
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get secret from environment - MUST match frontend
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"


def verify_jwt_token(token: str) -> dict:
    """
    Verify JWT token and return payload.

    Args:
        token: JWT token string

    Returns:
        dict: Token payload with user info

    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise JWTError(f"Invalid token: {str(e)}")


def extract_user_id(token: str) -> str:
    """
    Extract user ID from JWT token.

    Phase III: Returns string user_id per constitution requirement.

    Args:
        token: JWT token string

    Returns:
        str: User ID from token (string type)

    Raises:
        JWTError: If token is invalid or user_id not found
    """
    payload = verify_jwt_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise JWTError("User ID not found in token")

    # Ensure user_id is string type (Phase III constitution requirement)
    return str(user_id)


def create_access_token(user_id: str, expires_delta: timedelta = None) -> str:
    """
    Create JWT access token with string user_id.

    Phase III: Accepts and encodes string user_id in 'sub' claim.

    Args:
        user_id: String user ID (Phase III constitution-compliant)
        expires_delta: Token expiration time (default: 24 hours)

    Returns:
        str: Encoded JWT token
    """
    if expires_delta is None:
        expires_delta = timedelta(hours=24)

    expire = datetime.utcnow() + expires_delta
    payload = {
        "sub": str(user_id),  # Ensure string type
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
