from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run

import logging

from api.plants import plants_router

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://frontend:8080",
        "http://frontend:80",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plants_router)


if __name__ == "__main__":
    run("main:app", host="0.0.0.0", port=8000, reload=True)
