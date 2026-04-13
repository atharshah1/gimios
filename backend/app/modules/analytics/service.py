from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.models.attendance import Attendance, AttendanceStatus
from app.models.subscription import Subscription
from app.models.user import User, UserRole
from app.modules.analytics.schema import DashboardMetrics


class AnalyticsService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def dashboard(self, auth: AuthContext) -> DashboardMetrics:
        total_attendance_q = await self.db.execute(
            select(func.count(Attendance.id)).where(Attendance.gym_id == auth.gym_id)
        )
        present_attendance_q = await self.db.execute(
            select(func.count(Attendance.id)).where(
                Attendance.gym_id == auth.gym_id,
                Attendance.status == AttendanceStatus.present,
            )
        )
        total = total_attendance_q.scalar_one() or 0
        present = present_attendance_q.scalar_one() or 0
        attendance_rate = float((present / total) * 100) if total else 0.0

        revenue_q = await self.db.execute(
            select(func.coalesce(func.sum(Subscription.plan_amount), 0)).where(Subscription.gym_id == auth.gym_id)
        )
        revenue = int(revenue_q.scalar_one() or 0)

        active_members_q = await self.db.execute(
            select(func.count(User.id)).where(
                User.gym_id == auth.gym_id,
                User.role == UserRole.member,
                User.is_active.is_(True),
            )
        )
        inactive_members_q = await self.db.execute(
            select(func.count(User.id)).where(
                User.gym_id == auth.gym_id,
                User.role == UserRole.member,
                User.is_active.is_(False),
            )
        )
        trainers_q = await self.db.execute(
            select(func.count(User.id)).where(User.gym_id == auth.gym_id, User.role == UserRole.trainer)
        )

        member_growth = int(active_members_q.scalar_one() or 0)
        churn = int(inactive_members_q.scalar_one() or 0)
        trainer_count = int(trainers_q.scalar_one() or 0)
        trainer_performance = attendance_rate / trainer_count if trainer_count else 0.0

        return DashboardMetrics(
            attendance_rate=round(attendance_rate, 2),
            revenue=revenue,
            member_growth=member_growth,
            churn=churn,
            trainer_performance=round(trainer_performance, 2),
        )
