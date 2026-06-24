from fastapi import APIRouter, Depends

from api.users.users_dependencies import auth_required, admin_required
from api.users.users_schemas import AuthUserResponse

from api.shared import Pagination

from .stories_schemas import CreateStoryDTO, CreateStoryTagDTO, STORY_STATUS
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


@stories_router.get("/requests")
async def get_requests(
    status: STORY_STATUS = STORY_STATUS.NEW,
    pagination=Depends(Pagination),
    service: StoriesService = Depends(get_service),
    _=Depends(admin_required),
):
    return await service.get_stories_requests(
        limit=pagination.limit, offset=pagination.offset, status=status.value
    )


@stories_router.get("/")
async def get_stories(
    pagination=Depends(Pagination), service: StoriesService = Depends(get_service)
):
    return await service.get_stories(limit=pagination.limit, offset=pagination.offset)


@stories_router.post("/new")
async def create_story(
    body: CreateStoryDTO,
    user: AuthUserResponse = Depends(auth_required),
    service: StoriesService = Depends(get_service),
):
    return await service.create_story(body=body, author_id=str(user.id))


@stories_router.patch("/status")
async def change_story_status(
    story_id: int,
    new_status: STORY_STATUS,
    admin_info=Depends(admin_required),
    service: StoriesService = Depends(get_service),
):
    return await service.update_story_status(
        story_id=story_id, new_status=new_status.value, admin_id=admin_info.id
    )
