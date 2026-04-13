from fastapi import APIRouter

from app.modules.analytics.controller import router as analytics_router
from app.modules.attendance.controller import router as attendance_router
from app.modules.auth.controller import router as auth_router
from app.modules.billing.controller import router as billing_router
from app.modules.gym.controller import router as gym_router
from app.modules.roster.controller import router as roster_router
from app.modules.slots.controller import router as slots_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(gym_router)
api_router.include_router(roster_router)
api_router.include_router(slots_router)
api_router.include_router(attendance_router)
api_router.include_router(billing_router)
api_router.include_router(analytics_router)
