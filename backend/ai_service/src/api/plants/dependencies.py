from fastapi import Depends
from pydantic import BaseModel

from .sqlite_repository import SQLitePlantsRepository, ABCPlantsRepository
from .service import PlantsService


class Pagination(BaseModel):
    limit: int = 10
    offset: int = 0


def get_sqlite_repo() -> SQLitePlantsRepository:
    SQLITE_FILE = "translations.db"
    return SQLitePlantsRepository(SQLITE_FILE)


def get_plants_service(
    repo: ABCPlantsRepository = Depends(get_sqlite_repo),
) -> PlantsService:
    return PlantsService(repo=repo)
