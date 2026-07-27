from fastapi import UploadFile

import aiofiles

from asyncpg import Connection
from asyncpg.exceptions import UniqueViolationError

from uuid import UUID, uuid4
from pathlib import Path
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
from .partners_exceptions import (
    IncorrectImageType,
    PartnerAlreadyExists,
    PartnerNotFound,
    UserIsNotRepresentative,
)


class PartnersRepository:
    def __init__(self, db, logger: Logger) -> None:
        self.db: Connection = db
        self.logger = logger

    async def _save_photo_file(self, img: str) -> str | None:
        # TODO: save as WEBP
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

    async def __save_base64_photos(
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

    async def __save_uploadfile_photos(
        self, partner_id: str | UUID, images: List[UploadFile]
    ):
        saved = []
        for image in images:
            fileid = uuid4()

            filename = f"{fileid}.jpg"

            filepath = f"{cfg_obj.UPLOAD_DIR}/{filename}"

            content = await image.read()

            async with aiofiles.open(filepath, "wb") as buffer:
                await buffer.write(content)

            await self.db.execute(
                "INSERT INTO partners_photos (path, partner_id) VALUES ($1, $2)",
                filename,
                str(partner_id),
            )

            saved.append(filename)

        return saved

    async def _save_partners_images(
        self, partner_id: str | UUID, images: List[str] | List[UploadFile]
    ) -> List[str]:
        if len(images) < 1:
            return []
        if isinstance(images[0], str):
            saved = await self.__save_base64_photos(
                partner_id=partner_id, images=images
            )
            return saved
        else:
            saved = await self.__save_uploadfile_photos(
                partner_id=partner_id, images=images
            )
            return saved

    async def get_all_partners(self, limit: int, offset: int) -> List[Partner]:
        records = await self.db.fetch(
            """SELECT 
id, 
name, 
description, 
trusted, 
status, 
created_at 
FROM partners 
WHERE status=$1 
LIMIT $2 OFFSET $3""",
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

    async def get_partners_by_rep(
        self, user_id: str | UUID, limit: int, offset: int
    ) -> List[Partner]:

        partners_id = await self.db.fetch(
            """SELECT pr.partner_id 
FROM partners_reps pr
JOIN partners p ON p.id = pr.partner_id
WHERE pr.user_id = $1 
  AND p.status = $2
LIMIT $3 OFFSET $4;""",
            str(user_id),
            PartnerRequestStatus.APPROVED.value,
            limit,
            offset,
        )

        partners_id = [partner.get("partner_id", None) for partner in partners_id]

        result = []

        for partner_id in partners_id:
            record = await self.db.fetchrow(
                """SELECT 
id, 
name, 
description, 
trusted, 
status, 
created_at 
FROM partners 
WHERE id=$1""",
                partner_id,
            )

            record = dict(record)
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

    async def delete_partner(self, partner_id: str) -> bool:
        """
        Удаляет партнера и все связанные данные:
        - Удаляет фотографии из файловой системы и БД
        - Удаляет документы из файловой системы и БД
        - Удаляет социальные сети
        - Удаляет представителей
        - Удаляет партнера из БД
        """
        try:
            # Проверяем, существует ли партнер
            partner_exists = await self.db.fetchval(
                "SELECT id FROM partners WHERE id=$1", partner_id
            )
            if partner_exists is None:
                raise PartnerNotFound

            # Получаем список фотографий
            photos = await self._get_partners_photos(partner_id=partner_id)
            # Удаляем файлы фотографий
            for photo in photos:
                photo_path = Path(f"{cfg_obj.UPLOAD_DIR}/{photo}")
                if photo_path.exists():
                    photo_path.unlink()

            # Удаляем записи фотографий из БД
            await self.db.execute(
                "DELETE FROM partners_photos WHERE partner_id=$1", partner_id
            )

            # Получаем список документов
            docs = await self._get_partners_docs(partner_id=partner_id)
            # Удаляем файлы документов
            for doc in docs:
                doc_path = Path(f"{cfg_obj.UPLOAD_DIR}/{doc}")
                if doc_path.exists():
                    doc_path.unlink()

            # Удаляем записи документов из БД
            await self.db.execute(
                "DELETE FROM partners_docs WHERE partner_id=$1", partner_id
            )

            # Удаляем социальные сети
            await self.db.execute(
                "DELETE FROM partners_socials WHERE partner_id=$1", partner_id
            )

            # Удаляем представителей
            await self.db.execute(
                "DELETE FROM partners_reps WHERE partner_id=$1", partner_id
            )

            # Удаляем партнера
            await self.db.execute("DELETE FROM partners WHERE id=$1", partner_id)

            return True

        except PartnerNotFound:
            raise
        except Exception as e:
            self.logger.error(f"delete_partner error: {e} - {type(e)}")
            raise e

    async def update_partner(self, partner_id: str):
        pass

    async def update_partner_doc(self, partner_id: str, file: UploadFile) -> None:
        pass

    async def _save_partners_socials(
        self, partner_id: UUID | str, socials: List[Social]
    ) -> None:
        self.logger.info(f"Saving socials for {partner_id}")
        try:
            for social in socials:

                await self.db.execute(
                    "INSERT INTO partners_socials (partner_id, social, url) VALUES($1, $2, $3)",
                    partner_id,
                    social.social,
                    social.url,
                )

        except Exception as e:
            self.logger.error(
                f"save_partners_socials error for {partner_id}: {e} - {type(e)}"
            )

    async def create_partner_request(
        self,
        body: CreatePartnerRequestDTO,
        user: AuthUserResponse,
        document: UploadFile | None,
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

        if len(body.socials) > 0:
            await self._save_partners_socials(created_partner_id, socials=body.socials)

        if document is not None:
            await self.add_partner_document(
                created_partner_id, document=document, user=user
            )

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

    async def _check_is_representative(
        self, user_id: str | UUID, partner_id: str | UUID
    ) -> bool:
        record = await self.db.fetchval(
            "SELECT user_id FROM partners_reps WHERE partner_id=$1 AND user_id=$2",
            partner_id,
            user_id,
        )

        if record is None:
            return False

        return True

    async def _change_trusted_status(
        self, partner_id: str | UUID, new_status: bool
    ) -> None:
        await self.db.execute(
            "UPDATE partners SET trusted=$1 WHERE id=$2", new_status, partner_id
        )

    async def add_partner_document(
        self, partner_id: str | UUID, document: UploadFile, user: AuthUserResponse
    ) -> str:
        self.logger.info(f"Saving document for {partner_id}")

        is_rep = await self._check_is_representative(
            user_id=user.id, partner_id=partner_id
        )

        if not is_rep or user.role != USERS_ROLES.ADMIN.value:
            raise UserIsNotRepresentative

        # Save doc as file
        file_id = uuid4()
        filename = f"{file_id}.pdf"
        filepath = Path(f"{cfg_obj.UPLOAD_DIR}/{filename}")

        async with aiofiles.open(filepath, "wb") as buffer:
            content = await document.read()
            await buffer.write(content)

        # Save doc as DB record
        try:
            await self.db.execute(
                "INSERT INTO partners_docs (path, partner_id) VALUES ($1, $2)",
                filename,
                str(partner_id),
            )
        except Exception as e:
            if filepath.exists():
                filepath.unlink()
            self.logger.error(f"Failed to save document to DB for {partner_id}: {e}")
            raise

        await self._change_trusted_status(partner_id=partner_id, new_status=True)

        return filename
