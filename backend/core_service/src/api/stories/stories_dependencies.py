from fastapi import Depends, Request

from core.db.postgres import get_pg_connection

from .stories_repository import StoriesRepository
from .stories_service import StoriesService


async def get_repository(request: Request, db=Depends(get_pg_connection)):
    repo = StoriesRepository(db)
    # Передаем пул соединений для фоновых операций
    repo.set_pool(request.app.state.pg_pool)
    return repo


def get_service(repo=Depends(get_repository)):
    return StoriesService(repo)
