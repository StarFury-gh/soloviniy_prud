from fastapi import APIRouter, Depends, UploadFile

from api.shared import Pagination
from api.users.users_dependencies import admin_required

from .partners_service import PartnersService
from .partners_dependencies import get_service
from .partners_schemas import CreatePartnerDTO

partners_router = APIRouter(prefix="/partners", tags=["partners"])


@partners_router.get("/")
async def get_all_partners(
    service: PartnersService = Depends(get_service),
    pagination: Pagination = Depends(Pagination),
):
    return await service.get_all_partners(
        limit=pagination.limit, offset=pagination.offset
    )


@partners_router.post("/new")
async def create_partner(
    body: CreatePartnerDTO = Depends(),
    service: PartnersService = Depends(get_service),
    _=Depends(admin_required),
):
    return await service.create_partner(body=body)


@partners_router.delete("/{partner_id}")
async def delete_partner(
    partner_id: str,
    service: PartnersService = Depends(get_service),
    _=Depends(admin_required),
):
    pass


@partners_router.patch("/{partner_id}")
async def update_partner(
    partner_id: str, service: PartnersService = Depends(get_service)
):
    pass
