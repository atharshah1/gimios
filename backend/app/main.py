from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, gym, users, hrms, timeslot, attendance, workout, wearable, billing, admin

app = FastAPI(title="GymOS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(gym.router, prefix="/api/v1/gyms", tags=["gyms"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(hrms.router, prefix="/api/v1/hrms", tags=["hrms"])
app.include_router(timeslot.router, prefix="/api/v1/timeslots", tags=["timeslots"])
app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["attendance"])
app.include_router(workout.router, prefix="/api/v1/workouts", tags=["workouts"])
app.include_router(wearable.router, prefix="/api/v1/wearable", tags=["wearable"])
app.include_router(billing.router, prefix="/api/v1/billing", tags=["billing"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
