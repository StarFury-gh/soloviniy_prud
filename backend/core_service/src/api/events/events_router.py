from fastapi import APIRouter, Depends

from api.users.users_dependencies import admin_required
from api.shared import Pagination


from .events_schemas import EVENT_STATUS, CreateEventDTO, UpdateEventDTO
from .events_service import EventsService
from .events_dependencies import get_service

events_router = APIRouter(prefix="/events", tags=["events"])


@events_router.post("/new")
async def create_event(
    body: CreateEventDTO,
    admin=Depends(admin_required),
    service: EventsService = Depends(get_service),
):
    return await service.create_event(body=body, created_by=admin.id)


@events_router.get("/")
async def get_events(
    event_status: EVENT_STATUS,
    pagination=Depends(Pagination),
    service: EventsService = Depends(get_service),
):
    return await service.get_events(
        event_status=event_status.value,
        limit=pagination.limit,
        offset=pagination.offset,
    )


@events_router.patch("/{event_id}")
async def update_event(
    event_id: int,
    body: UpdateEventDTO,
    _=Depends(admin_required),
    service: EventsService = Depends(get_service),
):
    return await service.update_event(event_id=event_id, body=body)


@events_router.delete("/delete/{event_id}")
async def delete_event(
    event_id: int,
    _=Depends(admin_required),
    service: EventsService = Depends(get_service),
):
    return await service.delete_event(event_id=event_id)
