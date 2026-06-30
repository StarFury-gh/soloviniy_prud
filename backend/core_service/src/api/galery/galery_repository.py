from asyncpg import Connection
from asyncpg.exceptions import ForeignKeyViolationError

import aiofiles
import base64
from typing import List
from uuid import UUID, uuid4

from core.config import cfg_obj

from api.users.users_schemas import USERS_ROLES

from .galery_schemas import (
    GaleryPhotoAuthor,
    GaleryPublication,
    GaleryPublicationStatus,
)
from .galery_exceptions import (
    AuthorNotFound,
    IncorrectImageType,
    PublicationNotFound,
    BaseGaleryException,
)


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
WHERE g.status=$1
GROUP BY g.publishing_id, g.author_id, u.name, u.surname
ORDER BY g.publishing_id
LIMIT $2 OFFSET $3;
        """

        records = await self.db.fetch(
            stmt, GaleryPublicationStatus.APPROVED.value, limit, offset
        )

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
        self, photos: List[str], user_id: UUID | str, user_role: str | USERS_ROLES
    ) -> List[str] | None:
        saved = []
        publishing_status = GaleryPublicationStatus.NEW.value
        if user_role == USERS_ROLES.ADMIN.value:
            publishing_status = GaleryPublicationStatus.APPROVED.value
        publishing_id = str(uuid4())
        try:
            # TODO: Add to transaction
            # Saving galery publication
            await self.db.execute(
                "INSERT INTO galery (author_id, publishing_id, status) VALUES ($1, $2, $3)",
                user_id,
                publishing_id,
                publishing_status,
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
            # TODO: change to logger
            print(e, type(e))

    async def get_photos_requests(
        self, limit: int, offset: int, status: str | GaleryPublicationStatus
    ) -> List[GaleryPublication]:
        stmt = """SELECT 
    g.publishing_id,
    g.author_id,
    u.name,
    u.surname,
    ARRAY_AGG(gp.path ORDER BY gp.id) AS photos
FROM galery g
JOIN users u ON g.author_id = u.id
LEFT JOIN galery_photos gp ON g.publishing_id = gp.publishing_id
WHERE g.status=$1
GROUP BY g.publishing_id, g.author_id, u.name, u.surname
ORDER BY g.publishing_id
LIMIT $2 OFFSET $3;
        """

        records = await self.db.fetch(stmt, status, limit, offset)

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

    async def update_publication_status(
        self, publishing_id: str, new_status: str
    ) -> bool:
        try:
            author_id = await self.db.fetchval(
                "UPDATE galery SET status=$1 WHERE publishing_id=$2 RETURNING author_id",
                new_status,
                publishing_id,
            )
            if author_id is not None:
                return True
            raise PublicationNotFound

        except BaseGaleryException as e:
            raise e

        except Exception as e:
            # TODO: change to logger
            print(e, type(e))
