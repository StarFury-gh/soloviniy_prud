from fastapi import APIRouter, Depends
from .stories_service import StoriesService
from .stories_dependencies import get_service


stories_router = APIRouter(
    prefix="/stories",
    tags=["stories"]
)
