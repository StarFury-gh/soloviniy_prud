import aiofiles

from uuid import UUID, uuid4
from typing import List
import base64
from logging import Logger

from core.config import cfg_obj

from .partners_schemas import Partner
from .partners_exceptions import IncorrectImageType


class PartnersRepository:
    def __init__(self, db, logger: Logger) -> None:
        self.db = db
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
            """SELECT 
p.id, 
p.name, 
p.description, 
COALESCE(array_agg(DISTINCT pp.path) FILTER (WHERE pp.path IS NOT NULL), '{}') AS photos
FROM partners AS p
LEFT JOIN partners_photos AS pp ON p.id = pp.partner_id
GROUP BY
    p.id
ORDER BY name DESC
LIMIT $1 OFFSET $2
""",
            limit,
            offset,
        )

        partners = [Partner(**(dict(partner))) for partner in records]

        return partners

    async def create_partner(
        self, name: str, description: str, photos: List[str]
    ) -> Partner:
        created_partner_id = await self.db.fetchval(
            "INSERT INTO partners (name, description) VALUES ($1, $2) RETURNING id",
            name,
            description,
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
