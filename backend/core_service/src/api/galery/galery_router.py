from fastapi import APIRouter, Depends

from api.shared import Pagination
from api.users.users_dependencies import auth_required, AuthUserResponse

from .galery_service import GaleryService
from .galery_dependencies import get_service
from .galery_schemas import AddGaleryPhotosDTO

galery_router = APIRouter(prefix="/galery", tags=["galery"])


@galery_router.get("/")
async def get_photos(
    pagination=Depends(Pagination), service: GaleryService = Depends(get_service)
):
    return await service.get_photos(limit=pagination.limit, offset=pagination.offset)


@galery_router.post("/add")
async def add_photos(
    body: AddGaleryPhotosDTO,
    user: AuthUserResponse = Depends(auth_required),
    service: GaleryService = Depends(get_service),
):
    return await service.add_photos(body=body, user_id=user.id)
