import hashlib
import hmac
import json
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.gym import Gym, GymStatus
from app.models.subscription import Subscription
from app.models.user import User, UserRole

router = APIRouter()


class CreateSubscriptionRequest(BaseModel):
    gym_id: uuid.UUID


@router.post("/subscribe")
async def create_subscription(
    body: CreateSubscriptionRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner):
        raise HTTPException(status_code=403, detail="Forbidden")

    # Ensure subscription doesn't already exist
    existing = await db.execute(select(Subscription).where(Subscription.gym_id == body.gym_id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Subscription already exists")

    # Create Razorpay subscription (placeholder — integrate SDK in production)
    razorpay_sub_id = f"sub_placeholder_{body.gym_id}"

    subscription = Subscription(
        gym_id=body.gym_id,
        razorpay_sub_id=razorpay_sub_id,
        status="created",
    )
    db.add(subscription)
    await db.commit()
    await db.refresh(subscription)
    return subscription


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body_bytes = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    expected = hmac.HMAC(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body_bytes,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = json.loads(body_bytes)
    event_type = event.get("event")
    sub_id = event.get("payload", {}).get("subscription", {}).get("entity", {}).get("id")

    if not sub_id:
        return {"detail": "ignored"}

    result = await db.execute(select(Subscription).where(Subscription.razorpay_sub_id == sub_id))
    subscription = result.scalar_one_or_none()
    if not subscription:
        return {"detail": "subscription not found"}

    gym_result = await db.execute(select(Gym).where(Gym.id == subscription.gym_id))
    gym = gym_result.scalar_one_or_none()

    if event_type == "subscription.activated":
        subscription.status = "active"
        if gym:
            gym.status = GymStatus.active
    elif event_type == "subscription.halted":
        subscription.status = "halted"
        if gym:
            gym.status = GymStatus.suspended
    elif event_type == "subscription.cancelled":
        subscription.status = "cancelled"
        if gym:
            gym.status = GymStatus.cancelled

    await db.commit()
    return {"detail": "processed"}
