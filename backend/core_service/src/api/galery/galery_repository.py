from asyncpg import Connection
from asyncpg.exceptions import ForeignKeyViolationError

import aiofiles
import base64
from typing import List
from uuid import UUID, uuid4

from core.config import cfg_obj

from .galery_schemas import GaleryPhoto, GaleryPhotoAuthor
from .galery_exceptions import AuthorNotFound, IncorrectImageType


class GaleryRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def get_photos(self, limit: int, offset: int) -> List[GaleryPhoto]:
        images = await self.db.fetch(
            """""",
            limit,
            offset,
        )

        result = []

        for image in images:
            image_as_dict = dict(image)
            author = GaleryPhotoAuthor(
                id=image_as_dict.get("author_id"),
                name=image_as_dict.get("name"),
                surname=image_as_dict.get("surname"),
            )

            result.append(GaleryPhoto(author=author, **image_as_dict))

        return result

    async def add_photos(
        self, photos: List[str], user_id: UUID | str
    ) -> List[str] | None:
        saved = []
        publishing_id = str(uuid4())
        try:
            # TODO: Add to transaction
            for photo in photos:
                if not photo.startswith("data:image"):
                    raise IncorrectImageType

                if "," in photo:
                    photo = photo.split(",")[1]

                filename = f"{uuid4()}.jpg"
                filepath = f"{cfg_obj.UPLOAD_DIR}/{filename}"
                photo_data_b64 = base64.b64decode(photo)

                async with aiofiles.open(filepath, "wb") as buffer:
                    await buffer.write(photo_data_b64)

                await self.db.execute(
                    "INSERT INTO galery_photos (author_id, path, publishing_id) VALUES ($1, $2, $3)",
                    user_id,
                    filename,
                    publishing_id,
                )

                saved.append(filename)

            return saved

        except ForeignKeyViolationError:
            raise AuthorNotFound

        except Exception as e:
            print(e, type(e))
