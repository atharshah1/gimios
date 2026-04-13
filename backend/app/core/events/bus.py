import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any

from app.core.redis import redis_client


@dataclass(slots=True)
class DomainEvent:
    event: str
    gym_id: str
    entity_id: str
    action: str
    timestamp: str


class EventBus:
    """Redis-backed bus with in-memory fallback for local development."""

    def __init__(self) -> None:
        self._events: list[DomainEvent] = []
        self.global_channel = "gimios:events"

    @staticmethod
    def gym_channel(gym_id: str) -> str:
        return f"gimios:{gym_id}:events"

    async def emit(self, event: str, gym_id: str, entity_id: str, action: str) -> DomainEvent:
        payload = DomainEvent(
            event=event,
            gym_id=gym_id,
            entity_id=entity_id,
            action=action,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        self._events.append(payload)
        try:
            serialized = json.dumps(asdict(payload))
            await redis_client.publish(self.global_channel, serialized)
            await redis_client.publish(self.gym_channel(gym_id), serialized)
        except Exception:
            pass
        return payload

    def recent(self, limit: int = 25) -> list[dict[str, Any]]:
        return [asdict(e) for e in self._events[-limit:]]


event_bus = EventBus()
