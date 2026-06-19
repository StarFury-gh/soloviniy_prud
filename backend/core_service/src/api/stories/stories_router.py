from fastapi import APIRouter, Depends

from api.users.users_dependencies import auth_required, admin_required
from api.users.users_schemas import AuthUserResponse

from .stories_schemas import CreateStoryDTO, CreateStoryTagDTO
from .stories_service import StoriesService
from .stories_dependencies import get_service

stories_router = APIRouter(prefix="/stories", tags=["stories"])


@stories_router.get("/tags")
async def get_all_tags(service: StoriesService = Depends(get_service)):
    return await service.get_all_tags()


@stories_router.post("/new_tag")
async def create_tag(
    body: CreateStoryTagDTO,
    _=Depends(admin_required),
    service: StoriesService = Depends(get_service),
):
    return await service.create_tag(body=body)


@stories_router.post("/new")
async def create_story(
    body: CreateStoryDTO,
    user: AuthUserResponse = Depends(auth_required),
    service: StoriesService = Depends(get_service),
):
    return await service.create_story(body=body, author_id=str(user.id))
