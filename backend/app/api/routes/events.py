import asyncio
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.events import event_bus
from app.core.redis import redis_client
from app.models.user import UserRole

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/stream")
async def stream_events(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    gym_id: UUID | None = Query(default=None),
):
    if auth.role == UserRole.super_admin and gym_id:
        target_gym_id = str(gym_id)
    else:
        target_gym_id = str(auth.gym_id)

    if target_gym_id is None:
        raise HTTPException(status_code=400, detail="gym_id is required")

    channel = event_bus.gym_channel(target_gym_id)
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(channel)

    async def event_generator():
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=5)
                if message and message.get("data"):
                    yield f"data: {message['data']}\n\n"
                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.close()

    return StreamingResponse(event_generator(), media_type="text/event-stream")
