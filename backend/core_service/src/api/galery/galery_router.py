from fastapi import APIRouter, Depends

from api.shared import Pagination
from api.users.users_dependencies import auth_required, admin_required, AuthUserResponse

from .galery_service import GaleryService
from .galery_dependencies import get_service
from .galery_schemas import AddGaleryPhotosDTO, GaleryPublicationStatus

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
    return await service.add_photos(body=body, authorization=user)


@galery_router.get("/requests")
async def get_publications_requests(
    status: GaleryPublicationStatus,
    _=Depends(admin_required),
    pagination: Pagination = Depends(Pagination),
    service: GaleryService = Depends(get_service),
):
    return await service.get_photos_requests(
        limit=pagination.limit, offset=pagination.offset, status=status.value
    )


@galery_router.patch("/status")
async def update_publication_status(
    publishing_id: str,
    new_status: GaleryPublicationStatus,
    _=Depends(admin_required),
    service: GaleryService = Depends(get_service),
):
    return await service.update_publication_status(
        publishing_id=publishing_id, new_status=new_status.value
    )
