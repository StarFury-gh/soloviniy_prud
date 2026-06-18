from fastapi import Depends, Header

from core.db.postgres import get_pg_connection

from .users_repository import UsersRepository
from .users_service import UsersService


def get_repository(db=Depends(get_pg_connection)) -> UsersRepository:
    return UsersRepository(db)


def get_service(
    repo: UsersRepository = Depends(get_repository),
) -> UsersService:
    return UsersService(repo)


async def auth_required(
    authorization=Header(..., alias="Authorization"),
    service: UsersService = Depends(get_service),
):
    return await service.auth_user(authorization=authorization)


async def admin_required(
    authorization=Header(..., alias="Authorization"),
    service: UsersService = Depends(get_service),
):
    return await service.auth_admin(authorization=authorization)
