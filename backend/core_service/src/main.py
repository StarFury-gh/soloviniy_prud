from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from uvicorn import run

from api import (
    events_router,
    galery_router,
    partners_router,
    stories_router,
    users_router,
)
from core.config import cfg_obj
from core.db.postgres import create_pg_pool, init_admin
from core.logger import LOGGING_CONFIG, get_logger

logger = get_logger(__name__)


def __init_images_dir():
    from os import makedirs

    logger.debug(f"Initializing upload dir: {cfg_obj.UPLOAD_DIR}")
    makedirs(cfg_obj.UPLOAD_DIR, exist_ok=True)
    logger.debug("Upload dir initialized.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    __init_images_dir()
    pg_pool = await create_pg_pool()
    app.state.pg_pool = pg_pool
    await init_admin()
    yield
    await pg_pool.close()


app = FastAPI(lifespan=lifespan)

# Раздача статики
app.mount("/static", StaticFiles(directory=cfg_obj.UPLOAD_DIR))

app.add_middleware(
    CORSMiddleware,
    # Хосты, которым разрешено стучаться до API
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://frontend:80",
        "http://frontend:8080",
    ],
    allow_methods=["*"],
    # Заголовки, которые разрешены для запросов + базовые HTTP заголовки
    allow_headers=["Authorization"],
    allow_credentials=True,
)

# Подключаем внешние роутеры
app.include_router(users_router)
app.include_router(stories_router)
app.include_router(events_router)
app.include_router(galery_router)
app.include_router(partners_router)


# Health check endpoint
@app.get("/health")
async def health_check():
    return JSONResponse(status_code=200, content={"status": "healthy"})


if __name__ == "__main__":
    run(
        "main:app",
        host="0.0.0.0",
        port=cfg_obj.APP_PORT,
        # Если dev, то для быстрого обновления при сохранении
        # (в проде не нужно, т.к. понижает производительность)
        reload=cfg_obj.ENV_TYPE != "prod",
        log_config=LOGGING_CONFIG,
    )
