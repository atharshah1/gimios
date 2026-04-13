from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    error: str | None = None
    meta: dict[str, Any] | None = None


def success_response(data: T, meta: dict[str, Any] | None = None) -> ApiResponse[T]:
    return ApiResponse(success=True, data=data, meta=meta)


def error_response(message: str) -> ApiResponse[None]:
    return ApiResponse(success=False, error=message)
