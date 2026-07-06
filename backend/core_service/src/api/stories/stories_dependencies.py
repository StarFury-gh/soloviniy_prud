from fastapi import Depends, Request

from core.db.postgres import get_pg_connection
from core.logger import get_logger

from .stories_repository import StoriesRepository
from .stories_service import StoriesService


async def get_repository(
    request: Request,
    db=Depends(get_pg_connection),
    logger=Depends(lambda: get_logger("StoriesRepository")),
):
    repo = StoriesRepository(db, logger=logger)
    # Передаем пул соединений для фоновых операций
    repo.set_pool(request.app.state.pg_pool)
    return repo


def get_service(repo=Depends(get_repository), logger=lambda: Depends(get_logger)):
    return StoriesService(repo)
