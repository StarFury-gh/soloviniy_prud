from fastapi import Depends

from core.db.postgres import get_pg_connection

from .events_repository import EventsRepository
from .events_service import EventsService


def get_repository(db=Depends(get_pg_connection)):
    return EventsRepository(db)


def get_service(repo=Depends(get_repository)):
    return EventsService(repo)
