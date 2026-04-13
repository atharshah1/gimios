from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any


@dataclass(slots=True)
class DomainEvent:
    event: str
    gym_id: str
    entity_id: str
    action: str
    timestamp: str


class EventBus:
    """Simple in-process event bus placeholder for SSE/WebSocket fanout."""

    def __init__(self) -> None:
        self._events: list[DomainEvent] = []

    def emit(self, event: str, gym_id: str, entity_id: str, action: str) -> DomainEvent:
        payload = DomainEvent(
            event=event,
            gym_id=gym_id,
            entity_id=entity_id,
            action=action,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        self._events.append(payload)
        return payload

    def recent(self, limit: int = 25) -> list[dict[str, Any]]:
        return [e.__dict__ for e in self._events[-limit:]]


event_bus = EventBus()
