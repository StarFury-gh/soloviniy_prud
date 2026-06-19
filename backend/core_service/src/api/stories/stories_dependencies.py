from fastapi import Depends

from core.db.postgres import get_pg_connection

from .stories_repository import StoriesRepository
from .stories_service import StoriesService


def get_repository(db=Depends(get_pg_connection)):
    return StoriesRepository(db)


def get_service(repo=Depends(get_repository)):
    return StoriesService(repo)
