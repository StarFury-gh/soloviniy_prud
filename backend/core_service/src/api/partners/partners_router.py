import json

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile

from api.shared import Pagination
from api.users.users_dependencies import admin_required, auth_required

from .partners_dependencies import get_service
from .partners_schemas import (
    CreatePartnerDTO,
    CreatePartnerRequestDTO,
    PartnerRequestStatus,
    Social,
    UpdatePartnerStatus,
)
from .partners_service import PartnersService

partners_router = APIRouter(prefix="/partners", tags=["partners"])


@partners_router.get("/")
async def get_all_partners(
    service: PartnersService = Depends(get_service),
    pagination: Pagination = Depends(Pagination),
):
    return await service.get_all_partners(
        limit=pagination.limit, offset=pagination.offset
    )


@partners_router.get("/representatives")
async def get_partners_by_rep(
    auth=Depends(auth_required),
    service: PartnersService = Depends(get_service),
    pagination: Pagination = Depends(Pagination),
):
    return await service.get_partners_by_rep(
        auth=auth, limit=pagination.limit, offset=pagination.offset
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
    return await service.delete_partner(partner_id=partner_id)


@partners_router.patch("/{partner_id}")
async def update_partner(
    partner_id: str, service: PartnersService = Depends(get_service)
):
    pass


@partners_router.get("/requests")
async def get_partners_requests(
    status: PartnerRequestStatus = Query(PartnerRequestStatus.NEW),
    pagination: Pagination = Depends(Pagination),
    service: PartnersService = Depends(get_service),
    _=Depends(admin_required),
):
    return await service.get_partners_requests(
        pagination=pagination, status=status.value
    )


@partners_router.patch("/{partner_id}/status")
async def update_partner_request_status(
    partner_id: str,
    body: UpdatePartnerStatus,
    service: PartnersService = Depends(get_service),
    _=Depends(admin_required),
):
    return await service.update_partner_request_status(
        partner_id=partner_id, new_status=body.new_status.value
    )


@partners_router.post("/requests/new")
async def create_partner_request(
    photos: list[UploadFile] = None,
    name: str = Form(...),
    description: str = Form(...),
    socials: str = Form(...),
    document: UploadFile | None = File(None),
    service: PartnersService = Depends(get_service),
    user=Depends(auth_required),
):
    socials_list = [Social(**item) for item in json.loads(socials)]

    photos = [] if photos is None else photos

    body = CreatePartnerRequestDTO(
        name=name, description=description, photos=photos, socials=socials_list
    )
    return await service.create_partner_request(body=body, user=user, document=document)


@partners_router.post("/add_doc/{partner_id}")
async def add_partner_document(
    partner_id: str,
    document: UploadFile,
    service: PartnersService = Depends(get_service),
    user=Depends(auth_required),
):
    return await service.add_partner_document(
        partner_id=partner_id, document=document, user=user
    )
