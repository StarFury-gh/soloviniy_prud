from fastapi import Depends

from core.db.postgres import get_pg_connection
from core.logger import get_logger

from .galery_repository import GaleryRepository
from .galery_service import GaleryService


def get_repository(
    db=Depends(get_pg_connection),
    logger=Depends(lambda: get_logger("GaleryRepository")),
):
    return GaleryRepository(db, logger=logger)


def get_service(repo=Depends(get_repository)):
    return GaleryService(repo)
