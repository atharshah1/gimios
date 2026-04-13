from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import auth, gym, users, hrms, timeslot, attendance, workout, wearable, billing, admin
from app.api.routes import api_router
from app.api.middlewares import RateLimitAndAuditMiddleware

app = FastAPI(title="GymOS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitAndAuditMiddleware, limit_per_minute=180)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"success": False, "data": None, "error": str(exc.detail)})


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"success": False, "data": None, "error": str(exc)})


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


# New contract-aligned modular API routes
app.include_router(api_router)
