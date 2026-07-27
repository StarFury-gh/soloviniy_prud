from fastapi import HTTPException, status, UploadFile

from logging import Logger
import os

from api.users.users_schemas import AuthUserResponse
from api.shared import Pagination

from .partners_repository import PartnersRepository
from .partners_schemas import (
    CreatePartnerDTO,
    UpdatePartnerDTO,
    CreatePartnerRequestDTO,
)
from .partners_exceptions import (
    IncorrectImageType,
    PartnerAlreadyExists,
    PartnerNotFound,
)

ALLOWED_MIME_TYPES = ["application/pdf", "application/x-pdf"]
ALLOWED_EXTENSIONS = [".pdf"]


class PartnersService:
    def __init__(self, repo: PartnersRepository, logger: Logger) -> None:
        self.repo = repo
        self.logger = logger

    async def get_all_partners(self, limit: int, offset: int):
        partners = await self.repo.get_all_partners(limit=limit, offset=offset)

        return {"partners": partners}

    async def get_partners_by_rep(
        self, auth: AuthUserResponse, limit: int, offset: int
    ):
        partners = await self.repo.get_partners_by_rep(
            user_id=auth.id, limit=limit, offset=offset
        )

        return {"partners": partners}

    async def create_partner(self, body: CreatePartnerDTO):
        try:
            created = await self.repo.create_partner(
                name=body.name, description=body.description, photos=body.photos
            )

            self.logger.info(f"Created partner: {created.id}")

            if created:
                await self.repo.update_partner_doc(id=created.id)

            return {"created": created}

        except IncorrectImageType:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image"
            )

        except Exception as e:
            self.logger.error(f"create_partner error: {e} - {type(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def delete_partner(self, partner_id: str):
        try:
            deleted = await self.repo.delete_partner(partner_id=partner_id)
            if deleted:
                self.logger.info(f"Deleted partner: {partner_id}")
            return {"deleted": deleted}
        except PartnerNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Partner not found",
            )
        except Exception as e:
            self.logger.error(f"delete_partner error: {e} - {type(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def update_partner(self, partner_id: str, body: UpdatePartnerDTO):
        pass

    async def add_partner_document(
        self, partner_id: str, document: UploadFile, user: AuthUserResponse
    ):
        if document is not None:
            filename = document.filename or ""
            _, extension = os.path.splitext(filename)
            if extension.lower() not in ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Incorrect file extension, must be: {ALLOWED_EXTENSIONS}, given: {extension}",
                )

            content_type = document.content_type or ""
            if content_type not in ALLOWED_MIME_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Incorrect file MIME type, must be: {ALLOWED_EXTENSIONS}, given: {content_type}",
                )

            saved = await self.repo.add_partner_document(
                partner_id, document, user=user
            )

            return {"saved": saved}

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Empty document."
            )

    async def get_partners_requests(self, pagination: Pagination, status: str):
        requests = await self.repo.get_partners_requests(
            limit=pagination.limit, offset=pagination.offset, status=status
        )

        return {"requests": requests}

    async def create_partner_request(
        self,
        body: CreatePartnerRequestDTO,
        user: AuthUserResponse,
        document: UploadFile | None,
    ):
        try:
            created = await self.repo.create_partner_request(
                body=body, user=user, document=document
            )

            return {"created": created}

        except PartnerAlreadyExists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Partner with name '{body.name}' already exists",
            )

        except Exception as e:
            self.logger.error(f"create_partner_request: {e} - {type(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def update_partner_request_status(self, partner_id: str, new_status: str):
        try:
            await self.repo.update_partner_request_status(
                partner_id=partner_id, new_status=new_status
            )
            return {"updated": True}

        except Exception as e:
            self.logger.error(f"create_partner_request: {e} - {type(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )
