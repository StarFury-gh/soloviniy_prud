from fastapi import APIRouter, Depends
from .events_service import EventsService
from .events_dependencies import get_service


events_router = APIRouter(
    prefix="/events",
    tags=["events"]
)
