from fastapi import Request
from asyncpg import create_pool


from core.config import cfg_obj


async def create_pg_pool():
    pool = await create_pool(cfg_obj.PG_DSN, min_size=5, max_size=20)
    return pool


async def get_pg_connection(request: Request):
    async with request.app.state.pg_pool.acquire() as connection:
        yield connection
