import logging
import time

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.redis import redis_client

logger = logging.getLogger("gimios.security")


class RateLimitAndAuditMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit_per_minute: int = 120):
        super().__init__(app)
        self.limit = limit_per_minute

    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        key = f"ratelimit:{ip}:{int(time.time() // 60)}"
        try:
            count = await redis_client.incr(key)
            if count == 1:
                await redis_client.expire(key, 61)
            if count > self.limit:
                return JSONResponse(status_code=429, content={"success": False, "data": None, "error": "Rate limit exceeded"})
        except Exception:
            pass

        started = time.time()
        response = await call_next(request)
        elapsed = round((time.time() - started) * 1000, 2)

        logger.info(
            "request",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "ip": ip,
                "duration_ms": elapsed,
            },
        )
        return response
