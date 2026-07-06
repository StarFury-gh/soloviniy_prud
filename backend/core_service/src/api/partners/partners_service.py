from fastapi import HTTPException, status

from logging import Logger

from .partners_repository import PartnersRepository
from .partners_schemas import CreatePartnerDTO, UpdatePartnerDTO
from .partners_exceptions import IncorrectImageType


class PartnersService:
    def __init__(self, repo: PartnersRepository, logger: Logger) -> None:
        self.repo = repo
        self.logger = logger

    async def get_all_partners(self, limit: int, offset: int):
        partners = await self.repo.get_all_partners(limit=limit, offset=offset)

        return {"partners": partners}

    async def create_partner(self, body: CreatePartnerDTO):
        try:
            created = await self.repo.create_partner(
                name=body.name, description=body.description, photos=body.photos
            )

            self.logger.info(f"Created partner: {created.id}")

            return {"created": created}

        except IncorrectImageType:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image"
            )

        except Exception as e:
            self.logger.error(f"Creating partner error: {e} - {type(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def delete_partner(self, partner_id: str):
        pass

    async def update_partner(self, partner_id: str, body: UpdatePartnerDTO):
        pass
