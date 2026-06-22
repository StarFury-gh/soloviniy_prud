from fastapi import HTTPException, status

from uuid import UUID


from .events_exceptions import EventNotFound, IncorrectEventStatus, EmptyEventUpdate
from .events_repository import EventsRepository
from .events_schemas import CreateEventDTO, UpdateEventDTO


class EventsService:
    def __init__(self, repo: EventsRepository) -> None:
        self.repo = repo

    async def get_events(self, event_status: str, limit: int, offset: int):
        try:
            events = await self.repo.get_events(
                status=event_status, limit=limit, offset=offset
            )

            return {"events": events}

        except IncorrectEventStatus:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Incorrect event_status. Given: {event_status}",
            )

    async def create_event(self, body: CreateEventDTO, created_by: str | UUID):
        try:
            created_event = await self.repo.create_event(
                name=body.name,
                description=body.description,
                date=body.date,
                created_by=created_by,
                banner=body.banner,
            )

            if not created_event:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Internal server error. Cannot save the event.",
                )

            return {"created": created_event}

        except IncorrectEventStatus:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect event status"
            )

    async def delete_event(self, event_id: int):
        try:
            deleted_event = await self.repo.delete_event(event_id=event_id)

            return {"deleted": deleted_event}

        except EventNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
            )

    async def update_event(self, event_id: int, body: UpdateEventDTO):
        try:
            if (
                body.new_date is None
                and body.new_description is None
                and body.new_date is None
            ):
                raise EmptyEventUpdate

            updated_event = await self.repo.update_event(
                event_id=event_id,
                new_date=body.new_date,
                new_name=body.new_name,
                new_description=body.new_description,
            )

            return {"updated": updated_event}

        except EventNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
            )

        except EmptyEventUpdate:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect updating values",
            )
