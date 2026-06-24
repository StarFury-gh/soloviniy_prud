from fastapi import Depends

from core.db.postgres import get_pg_connection

from .galery_repository import GaleryRepository
from .galery_service import GaleryService


def get_repository(db=Depends(get_pg_connection)):
    return GaleryRepository(db)


def get_service(repo=Depends(get_repository)):
    return GaleryService(repo)
