"""Rate Limiting Middleware - Prevent API abuse

Implements rate limiting for chat endpoint (100 requests/hour/user)
Uses in-memory storage for simplicity (use Redis in production)
"""
from fastapi import HTTPException, status, Request
from typing import Dict
from datetime import datetime, timedelta
from collections import defaultdict


class RateLimiter:
    """Simple in-memory rate limiter"""

    def __init__(self, max_requests: int = 100, window_minutes: int = 60):
        """
        Initialize rate limiter.

        Args:
            max_requests: Maximum requests allowed per window
            window_minutes: Time window in minutes
        """
        self.max_requests = max_requests
        self.window = timedelta(minutes=window_minutes)
        self.requests: Dict[str, list] = defaultdict(list)

    def is_allowed(self, user_id: str) -> bool:
        """
        Check if request is allowed for user.

        Args:
            user_id: User ID to check

        Returns:
            bool: True if allowed, False if rate limit exceeded
        """
        now = datetime.utcnow()
        cutoff = now - self.window

        # Clean old requests
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if req_time > cutoff
        ]

        # Check if under limit
        if len(self.requests[user_id]) >= self.max_requests:
            return False

        # Record this request
        self.requests[user_id].append(now)
        return True

    def get_remaining(self, user_id: str) -> int:
        """Get remaining requests for user"""
        now = datetime.utcnow()
        cutoff = now - self.window

        # Clean old requests
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if req_time > cutoff
        ]

        return max(0, self.max_requests - len(self.requests[user_id]))


# Global rate limiter instance
# In production, use Redis for distributed rate limiting
chat_rate_limiter = RateLimiter(max_requests=100, window_minutes=60)


async def check_rate_limit(user_id: str, request: Request):
    """
    Dependency to check rate limit before processing request.

    Args:
        user_id: User ID from path
        request: FastAPI request object

    Raises:
        HTTPException: 429 if rate limit exceeded
    """
    if not chat_rate_limiter.is_allowed(user_id):
        remaining = chat_rate_limiter.get_remaining(user_id)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Try again in {chat_rate_limiter.window.seconds // 60} minutes.",
            headers={"Retry-After": str(chat_rate_limiter.window.seconds)}
        )

    # Add rate limit headers to response
    request.state.rate_limit_remaining = chat_rate_limiter.get_remaining(user_id)
