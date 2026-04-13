from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.modules.roster.schema import RosterUserCreate, RosterUserView


class RosterService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_by_role(self, auth: AuthContext, role: UserRole) -> list[RosterUserView]:
        result = await self.db.execute(
            select(User).where(User.gym_id == auth.gym_id, User.role == role)
        )
        return [RosterUserView.model_validate(row, from_attributes=True) for row in result.scalars().all()]

    async def create_user(self, auth: AuthContext, role: UserRole, body: RosterUserCreate) -> RosterUserView:
        user = User(
            gym_id=auth.gym_id,
            email=body.email,
            full_name=body.full_name,
            hashed_password=get_password_hash(body.password),
            role=role,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        await event_bus.emit("roster:changed", str(auth.gym_id), str(user.id), "created")
        return RosterUserView.model_validate(user, from_attributes=True)
