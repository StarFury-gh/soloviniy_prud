from fastapi import Depends

from core.db.postgres import get_pg_connection
from core.logger import get_logger

from .partners_repository import PartnersRepository
from .partners_service import PartnersService


def get_repository(
    db=Depends(get_pg_connection),
    logger=Depends(lambda: get_logger("PartnersRepository")),
):
    return PartnersRepository(db, logger)


def get_service(
    repo=Depends(get_repository), logger=Depends(lambda: get_logger("PartnersService"))
):
    return PartnersService(repo, logger)
