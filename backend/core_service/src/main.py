from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from uvicorn import run

from contextlib import asynccontextmanager

from api import users_router

from core.db.postgres import create_pg_pool, init_admin
from core.config import cfg_obj


@asynccontextmanager
async def lifespan(app: FastAPI):
    pg_pool = await create_pg_pool()
    app.state.pg_pool = pg_pool
    await init_admin()
    yield
    await pg_pool.close()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    # Хосты, которым разрешено стучаться до API
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://frontend:80",
    ],
    allow_methods=["*"],
    # Заголовки, которые разрешены для запросов + базовые HTTP заголовки
    allow_headers=["Authorization"],
    allow_credentials=True,
)

# Подключаем внешние роутеры
app.include_router(users_router)

if __name__ == "__main__":
    run(
        "main:app",
        host="0.0.0.0",
        port=cfg_obj.APP_PORT,
        # Если dev, то для быстрого обновления при сохранении (в проде не нужно, т.к. понижает производительность)
        reload=cfg_obj.ENV_TYPE != "prod",
    )
