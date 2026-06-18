from asyncpg import connect

from api.users.users_service import UsersService, UsersRepository

from core.config import cfg_obj
from api.users.users_schemas import CreateAdminDTO


async def init_admin():
    pg_conn = await connect(cfg_obj.PG_DSN)
    repo = UsersRepository(pg_conn)
    service = UsersService(repo)
    body = CreateAdminDTO(
        email=cfg_obj.ADMIN_EMAIL,  # type: ignore
        password=cfg_obj.ADMIN_PASSWORD,  # type: ignore
        name=cfg_obj.ADMIN_NAME,  # type: ignore
        surname=cfg_obj.ADMIN_SURNAME,  # type: ignore
    )
    await service.create_admin(body)
