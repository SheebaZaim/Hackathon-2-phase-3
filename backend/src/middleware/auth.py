"""JWT authentication middleware for Phase III - Constitution compliant

Extracts string user_id from JWT tokens per constitution requirement.
"""
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
import os
from sqlmodel import Session, select

from ..models.user import User, UserResponse
from ..database.connection import get_session

# Get secret from environment - MUST match frontend BETTER_AUTH_SECRET
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is required")

ALGORITHM = "HS256"

security = HTTPBearer()


def verify_token(token: str) -> dict:
    """Verify a JWT token and return the payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> dict:
    """
    Get the current user from the JWT token.

    Phase III: Returns string user_id per constitution requirement.

    Returns:
        dict: User context with string user_id and email
    """
    token = credentials.credentials
    payload = verify_token(token)

    # Extract user_id from token payload ('sub' claim per JWT standard)
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload - user_id not found"
        )

    # Ensure user_id is string type (Phase III constitution requirement)
    user_id = str(user_id)

    # Optional: Verify user still exists in database
    # Note: This adds a database query per request but ensures user validity
    statement = select(User).where(User.id == user_id)
    result = session.exec(statement)
    user = result.first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Return user context for use in endpoints
    # user_id is now a string type per Phase III constitution
    return {
        "user_id": str(user.id),  # Ensure string type
        "email": user.email
    }


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Extract user_id from JWT token without database lookup (faster).

    Phase III: Returns string user_id for stateless operations.
    Use this for stateless endpoints that don't need full user object.

    Returns:
        str: User ID from token
    """
    token = credentials.credentials
    payload = verify_token(token)

    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload - user_id not found"
        )

    # Return string user_id (stateless, no database query)
    return str(user_id)
