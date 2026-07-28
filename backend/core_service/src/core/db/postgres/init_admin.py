from asyncpg import connect

from api.users.users_service import UsersService, UsersRepository

from core.config import cfg_obj
from core.logger import get_logger

from api.users.users_schemas import RegisterUserDTO


async def init_admin():
    pg_conn = await connect(cfg_obj.PG_DSN)
    logger = get_logger(__name__)
    repo = UsersRepository(pg_conn)
    service = UsersService(repo, logger=logger)
    body = RegisterUserDTO(
        email=cfg_obj.ADMIN_EMAIL,  # type: ignore
        name=cfg_obj.ADMIN_NAME,  # type: ignore
    )
    await service.create_admin(body)
