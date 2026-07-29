from fastapi import UploadFile
from asyncpg import Connection
from PIL import Image
from io import BytesIO
import aiofiles

from datetime import datetime, timezone
from typing import List
from uuid import UUID, uuid4

from core.config import cfg_obj

import base64

from .events_exceptions import IncorrectEventStatus, EventNotFound, IncorrectImageType
from .events_schemas import EVENT_STATUS, Event


class EventsRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def get_events(self, status: str, limit: int, offset: int) -> List[Event]:
        comparison_sign = None
        current_date = datetime.now(timezone.utc)
        if status == EVENT_STATUS.PAST.value:
            comparison_sign = "<"
        elif status == EVENT_STATUS.FUTURE.value:
            comparison_sign = ">="
        else:
            raise IncorrectEventStatus

        stmt = f"""SELECT 
e.id, 
e.name, 
e.description, 
e.created_at, 
e.updated_at, 
e.created_by, 
e.date,
ei.path
FROM 
    events AS e 
LEFT JOIN events_images AS ei ON e.id=ei.event_id 
WHERE date {comparison_sign} $1 
ORDER BY 
    e.date
LIMIT $2 OFFSET $3;
"""

        events = await self.db.fetch(
            stmt,
            current_date,
            limit,
            offset,
        )

        events = [Event(**dict(event)) for event in events]

        return events

    async def __save_image_as_WEBP(self, image: str | UploadFile) -> str:

        if not image.startswith("data:image"):
            raise IncorrectImageType

        if "," in image:
            image = image.split(",")[1]

        content = base64.b64decode(image)
        content = BytesIO(content)

        img = Image.open(content)

        img.convert("RGB")

        fileid = uuid4()

        filename = f"{fileid}.webp"
        filepath = f"{cfg_obj.UPLOAD_DIR}/{filename}"

        img.save(filepath, "webp")

        return filename

    async def create_event(
        self,
        name: str,
        description: str,
        date: datetime,
        created_by: str | UUID,
        banner: str | None,
    ) -> Event | None:
        tx = self.db.transaction()
        await tx.start()
        created_event = None
        try:
            event = await self.db.fetchrow(
                "INSERT INTO events (name, description, date, created_by) VALUES ($1, $2, $3, $4) RETURNING id, name, description, created_at, updated_at, created_by, date",
                name,
                description,
                date,
                created_by,
            )

            created_event = Event(**dict(event))

            if banner:
                try:
                    saved_filename = await self.__save_image_as_WEBP(banner)
                except Exception as e:
                    print(f"__save_image_as_WEBP error: {e} - {type(e)=}")

                await self.db.execute(
                    "INSERT INTO events_images (event_id, path) VALUES ($1, $2)",
                    created_event.id,
                    saved_filename,
                )

            await tx.commit()

        except Exception as e:
            # TODO: change to logger
            print(e, type(e))
            await tx.rollback()

        return created_event

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
