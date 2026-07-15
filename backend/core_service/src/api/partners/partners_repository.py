from fastapi import UploadFile

import aiofiles

from asyncpg import Connection
from asyncpg.exceptions import UniqueViolationError

from uuid import UUID, uuid4
from typing import List
import base64
from logging import Logger

from core.config import cfg_obj
from api.users.users_schemas import USERS_ROLES, AuthUserResponse

from .partners_schemas import (
    Partner,
    CreatePartnerRequestDTO,
    PartnerRequestStatus,
    Social,
    PartnerRequest,
    PartnerRepresentative,
)
from .partners_exceptions import IncorrectImageType, PartnerAlreadyExists


class PartnersRepository:
    def __init__(self, db, logger: Logger) -> None:
        self.db: Connection = db
        self.logger = logger

    async def _save_photo_file(self, img: str) -> str | None:
        try:
            if not img.startswith("data:image"):
                raise IncorrectImageType

            if "," in img:
                img = img.split(",")[1]

            img_data_base64 = base64.b64decode(img)

            fileid = uuid4()

            filename = f"{fileid}.jpg"

            filepath = f"{cfg_obj.UPLOAD_DIR}/{filename}"

            async with aiofiles.open(filepath, "wb") as buffer:
                await buffer.write(img_data_base64)

            return filename

        except IncorrectImageType as e:
            raise e

        except Exception as e:
            self.logger.error(f"Saving photo error: {e}. {type(e)=}")
            return None

    async def _save_partners_images(
        self, partner_id: str | UUID, images: List[str]
    ) -> List[str]:
        saved = []
        for image in images:
            file_path = await self._save_photo_file(img=image)
            if file_path is not None:
                await self.db.execute(
                    "INSERT INTO partners_photos (path, partner_id) VALUES ($1, $2)",
                    file_path,
                    str(partner_id),
                )
                saved.append(file_path)

        return saved

    async def get_all_partners(self, limit: int, offset: int) -> List[Partner]:
        records = await self.db.fetch(
            "SELECT id, name, description, trusted, status, created_at FROM partners WHERE status=$1 LIMIT $2 OFFSET $3",
            PartnerRequestStatus.APPROVED.value,
            limit,
            offset,
        )

        dict_records = [dict(record) for record in records]

        result = []

        for record in dict_records:
            partner_id = record.get("id")
            photos = await self._get_partners_photos(partner_id=partner_id)
            docs = await self._get_partners_docs(partner_id=partner_id)
            reps = await self.get_partner_representatives(partner_id=partner_id)
            socials = await self.get_partner_socials(partner_id=partner_id)

            record.update({"photos": photos})
            record.update({"docs": docs})
            record.update({"representatives": reps})
            record.update({"socials": socials})

            result.append(PartnerRequest(**record))

        return result

    async def create_partner(
        self, name: str, description: str, photos: List[str]
    ) -> Partner:
        created_partner_id = await self.db.fetchval(
            "INSERT INTO partners (name, description, status) VALUES ($1, $2, $3) RETURNING id",
            name,
            description,
            PartnerRequestStatus.APPROVED.value,
        )

        saved_images = await self._save_partners_images(
            partner_id=created_partner_id, images=photos
        )

        created_partner = Partner(
            id=created_partner_id,
            name=name,
            description=description,
            photos=saved_images,
        )

        return created_partner

    async def delete_partner(self, partner_id: str):
        pass

    async def update_partner(self, partner_id: str):
        pass

    async def update_partner_doc(self, partner_id: str, file: UploadFile) -> None:
        pass

    async def _save_partners_socials(
        self, partner_id: UUID | str, socials: List[Social]
    ) -> None:
        try:
            for social in socials:

                await self.db.execute(
                    "INSERT INTO partners_socials (partner_id, social, url) VALUES($1, $2, $3)",
                    partner_id,
                    social.social,
                    social.url,
                )

        except Exception as e:
            self.logger.error(f"save_partners_socials error: {e} - {type(e)}")

    async def create_partner_request(
        self, body: CreatePartnerRequestDTO, user: AuthUserResponse
    ) -> Partner:
        create_with_status = (
            PartnerRequestStatus.APPROVED.value
            if user.role == USERS_ROLES.ADMIN.value
            else PartnerRequestStatus.NEW.value
        )

        try:
            created_partner_id = await self.db.fetchval(
                "INSERT INTO partners (name, description, status) VALUES ($1, $2, $3) RETURNING id",
                body.name,
                body.description,
                create_with_status,
            )
        except UniqueViolationError:
            raise PartnerAlreadyExists

        await self.db.execute(
            "INSERT INTO partners_reps (partner_id, user_id) VALUES ($1, $2)",
            created_partner_id,
            str(user.id),
        )

        saved_photos = await self._save_partners_images(
            partner_id=created_partner_id, images=body.photos
        )

        await self._save_partners_socials(created_partner_id, socials=body.socials)

        return Partner(
            id=created_partner_id,
            name=body.name,
            description=body.description,
            photos=saved_photos,
            socials=body.socials,
        )

    async def _get_partners_photos(self, partner_id: str) -> List[str]:
        records = await self.db.fetch(
            "SELECT path FROM partners_photos WHERE partner_id=$1", partner_id
        )

        return [dict(record).get("path") for record in records]

    async def _get_partners_docs(self, partner_id: str) -> List[str]:
        records = await self.db.fetch(
            "SELECT path FROM partners_docs WHERE partner_id=$1", partner_id
        )

        return [dict(record).get("path") for record in records]

    async def get_partner_representatives(
        self, partner_id: str
    ) -> List[PartnerRepresentative]:
        records = await self.db.fetch(
            "SELECT u.id, u.name, u.surname FROM users AS u JOIN partners_reps ON partners_reps.user_id=u.id WHERE partners_reps.partner_id=$1",
            partner_id,
        )

        return [PartnerRepresentative(**dict(record)) for record in records]

    async def get_partner_socials(self, partner_id: str) -> List[Social]:
        records = await self.db.fetch(
            "SELECT social, url FROM partners_socials WHERE partner_id=$1", partner_id
        )

        return [Social(**dict(record)) for record in records]

    async def get_partners_requests(
        self, limit: int, offset: int, status: str
    ) -> List[PartnerRequest]:

        records = await self.db.fetch(
            "SELECT id, name, description, trusted, status, created_at FROM partners WHERE status=$1 LIMIT $2 OFFSET $3",
            status,
            limit,
            offset,
        )

        dict_records = [dict(record) for record in records]

        result = []

        for record in dict_records:
            partner_id = record.get("id")
            photos = await self._get_partners_photos(partner_id=partner_id)
            docs = await self._get_partners_docs(partner_id=partner_id)
            reps = await self.get_partner_representatives(partner_id=partner_id)
            socials = await self.get_partner_socials(partner_id=partner_id)

            record.update({"photos": photos})
            record.update({"docs": docs})
            record.update({"representatives": reps})
            record.update({"socials": socials})

            result.append(PartnerRequest(**record))

        return result

    async def update_partner_request_status(
        self, partner_id: str, new_status: str
    ) -> bool:
        try:
            await self.db.execute(
                "UPDATE partners SET status=$1 WHERE id=$2", new_status, partner_id
            )
            return True
        except Exception as e:
            self.logger.error(f"update_partner_request_status error: {e} - {type(e)}")
            raise e
