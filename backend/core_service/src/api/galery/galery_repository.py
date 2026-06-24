from asyncpg import Connection
from asyncpg.exceptions import ForeignKeyViolationError

import aiofiles
import base64
from typing import List
from uuid import UUID, uuid4

from core.config import cfg_obj

from .galery_schemas import GaleryPhoto, GaleryPhotoAuthor, GaleryPublication
from .galery_exceptions import AuthorNotFound, IncorrectImageType


class GaleryRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def get_photos(self, limit: int, offset: int) -> List[GaleryPublication]:
        stmt = """SELECT 
    g.publishing_id,
    g.author_id,
    u.name,
    u.surname,
    ARRAY_AGG(gp.path ORDER BY gp.id) AS photos
FROM galery g
JOIN users u ON g.author_id = u.id
LEFT JOIN galery_photos gp ON g.publishing_id = gp.publishing_id
GROUP BY g.publishing_id, g.author_id, u.name, u.surname
ORDER BY g.publishing_id
LIMIT $1 OFFSET $2;
        """

        records = await self.db.fetch(stmt, limit, offset)

        result = []

        for record in records:
            record_as_dict = dict(record)
            author = GaleryPhotoAuthor(
                id=record_as_dict.get("author_id"),
                name=record_as_dict.get("name"),
                surname=record_as_dict.get("surname"),
            )
            galery_publication = GaleryPublication(
                publishing_id=record_as_dict.get("publishing_id"),
                author=author,
                photos=record_as_dict.get("photos"),
            )
            result.append(galery_publication)

        return result

    async def add_photos(
        self, photos: List[str], user_id: UUID | str
    ) -> List[str] | None:
        saved = []
        publishing_id = str(uuid4())
        try:
            # TODO: Add to transaction
            # Saving galery publication
            await self.db.execute(
                "INSERT INTO galery (author_id, publishing_id) VALUES ($1, $2)",
                user_id,
                publishing_id,
            )
            # Saving photos for galery publication
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
                    "INSERT INTO galery_photos (path, publishing_id) VALUES ($1, $2)",
                    filename,
                    publishing_id,
                )

                saved.append(filename)

            return saved

        except ForeignKeyViolationError:
            raise AuthorNotFound

        except Exception as e:
            print(e, type(e))
