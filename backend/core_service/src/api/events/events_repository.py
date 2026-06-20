from asyncpg import Connection

from datetime import datetime, timezone
from typing import List
from uuid import UUID

from .events_exceptions import IncorrectEventStatus, EventNotFound
from .events_schemas import EVENT_STATUS, Event


class EventsRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def get_events(self, status: str, limit: int, offset: int) -> List[Event]:
        current_date = datetime.now(timezone.utc)
        if status == EVENT_STATUS.PAST.value:
            stmt = "SELECT id, name, description, created_at, updated_at, created_by, date FROM events WHERE date < $1 LIMIT $2 OFFSET $3"

        elif status == EVENT_STATUS.FUTURE.value:
            stmt = "SELECT id, name, description, created_at, updated_at, created_by, date FROM events WHERE date >= $1 LIMIT $2 OFFSET $3"

        else:
            raise IncorrectEventStatus

        events = await self.db.fetch(
            stmt,
            current_date,
            limit,
            offset,
        )

        events = [Event(**dict(event)) for event in events]

        return events

    async def create_event(
        self, name: str, description: str, date: datetime, created_by: str | UUID
    ) -> Event:
        event = await self.db.fetchrow(
            "INSERT INTO events (name, description, date, created_by) VALUES ($1, $2, $3, $4) RETURNING id, name, description, created_at, updated_at, created_by, date",
            name,
            description,
            date,
            created_by,
        )

        return Event(**dict(event))

    async def delete_event(self, event_id: int) -> Event:
        deleted_event = await self.db.fetchrow(
            "DELETE FROM events WHERE id=$1 RETURNING id, name, description, created_at, updated_at, created_by, date",
            event_id,
        )

        if deleted_event is None:
            raise EventNotFound

        return Event(**dict(deleted_event))

    async def update_event(
        self,
        event_id: int,
        new_name: str | None,
        new_description: str | None,
        new_date: datetime | None,
    ) -> Event:
        if new_name is not None:
            await self.db.execute(
                "UPDATE events SET name=$1 WHERE id=$2", new_name, event_id
            )

        if new_description is not None:
            await self.db.execute(
                "UPDATE events SET description=$1 WHERE id=$2",
                new_description,
                event_id,
            )

        if new_date is not None:
            await self.db.execute(
                "UPDATE events SET date=$1 WHERE id=$2", new_date, event_id
            )

        updated_event = await self.db.fetchrow(
            "SELECT id, name, description, created_at, updated_at, created_by, date FROM events WHERE id=$1",
            event_id,
        )

        return Event(**dict(updated_event))
