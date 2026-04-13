import asyncio

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.core.redis import redis_client

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/stream")
async def stream_events():
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("gimios:events")

    async def event_generator():
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=5)
                if message and message.get("data"):
                    yield f"data: {message['data']}\n\n"
                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe("gimios:events")
            await pubsub.close()

    return StreamingResponse(event_generator(), media_type="text/event-stream")
