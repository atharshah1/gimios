from typing import Annotated
from uuid import UUID

from fastapi import Depends, Header, HTTPException, status
from jose import JWTError
from pydantic import BaseModel

from app.api.auth import oauth2_scheme
from app.core.security import decode_token
from app.models.user import UserRole


class AuthContext(BaseModel):
    user_id: UUID
    role: UserRole
    gym_id: UUID | None


def _parse_uuid(value: str | None, field: str) -> UUID | None:
    if value is None:
        return None
    try:
        return UUID(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid {field}") from exc


async def require_auth_context(
    token: Annotated[str, Depends(oauth2_scheme)],
    x_gym_id: Annotated[str | None, Header(alias="X-Gym-Id")] = None,
) -> AuthContext:
    try:
        payload = decode_token(token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    user_id = _parse_uuid(payload.get("sub"), "user id")
    role = payload.get("role")
    token_gym_id = _parse_uuid(payload.get("gym_id"), "gym id")

    if user_id is None or role is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    requested_gym_id = _parse_uuid(x_gym_id, "gym id")
    effective_gym_id = token_gym_id or requested_gym_id

    if role != UserRole.super_admin.value and effective_gym_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="gym_id is required")

    if token_gym_id and requested_gym_id and token_gym_id != requested_gym_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Gym scope mismatch")

    return AuthContext(user_id=user_id, role=UserRole(role), gym_id=effective_gym_id)
