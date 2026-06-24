from asyncpg import Connection, Pool
from asyncpg.exceptions import ForeignKeyViolationError
import aiofiles

from typing import List

import base64
from uuid import uuid4

from core.config import cfg_obj

from api.users.users_exceptions import UserNotFound

from .stories_exceptions import IncorrectImageType

from .stories_schemas import (
    Story,
    StoryTag,
    STORY_STATUS,
    FullStory,
    StoryAuthor,
    ReadableStory,
)


class StoriesRepository:
    def __init__(self, db: Connection) -> None:
        """
        Инициализация репозитория.

        :param db: asyncpg.Connection для работы с БД
        """
        self.db = db
        self.pool: Pool | None = None

    def set_pool(self, pool: Pool) -> None:
        """
        Устанавливает connection pool для фоновых операций.

        :param pool: Pool объект из asyncpg для управления соединениями.
        """
        self.pool = pool

    async def create_story_tag(self, tag_name: str) -> StoryTag:
        """
        Создаёт новый тег для истории в БД.

        :param tag_name: Название нового тега
        :return: StoryTag
        """
        tag_id = await self.db.fetchval(
            "INSERT INTO available_tags (name) VALUES ($1) RETURNING id", tag_name
        )
        return StoryTag(id=tag_id, name=tag_name)

    async def get_all_stories_tags(self) -> List[StoryTag]:
        """
        Получает список всех доступных тегов для историй.

        :return: List[StoryTag] со всеми тегами из БД.
        """
        tags = await self.db.fetch("SELECT id, name FROM available_tags")
        tags = [StoryTag(**dict(tag)) for tag in tags]
        return tags

    async def save_story(
        self, title: str, author_id: str, tags_ids: List[int], content: str
    ) -> Story | None:
        """
        Сохраняет новую историю в базу данных с указанными тегами.

        :param title: Заголовок истории
        :param author_id: ID автора (UUID)
        :param tags_ids: Список ID тегов для истории
        :param content: Текстовое содержимое истории
        :return: Story при создании, None при ошибке
        :raises UserNotFound: Если автор не найден
        """
        tx = self.db.transaction()
        await tx.start()
        try:
            created_story_id = await self.db.fetchval(
                "INSERT INTO stories (title, author_id, content, status) VALUES ($1, $2, $3, $4) RETURNING id",
                title,
                author_id,
                content,
                STORY_STATUS.NEW.value,
            )

            for tag_id in tags_ids:
                try:
                    await self.db.execute(
                        "INSERT INTO stories_tags (story_id, tag_id) VALUEs($1, $2)",
                        created_story_id,
                        tag_id,
                    )
                except ForeignKeyViolationError:
                    # TODO: change to logger
                    print(f"Tag with id #{tag_id} is not exists.")

            result = Story(
                id=created_story_id,
                author_id=author_id,
                title=title,
                tags=tags_ids,
                content=content,
                status=STORY_STATUS.NEW,
            )

            await tx.commit()

            return result

        except ForeignKeyViolationError:
            await tx.rollback()
            raise UserNotFound

        except Exception as e:
            # TODO: change to logger
            print(f"Saving story error: {e}")
            await tx.rollback()

    async def save_story_images_background(
        self, images: List[str], story_id: int
    ) -> List[str | None] | None:
        """
        Фоновое сохранение изображений для истории.

        :param images: Список изображений в base64
        :param story_id: ID истории
        :return: Список имен сохраненных файлов, None при ошибке.
        :raises IncorrectImageType: Если формат изображения не base64
        :raises RuntimeError: Если pool не был установлен
        """
        if self.pool is None:
            raise RuntimeError("Pool not set for background operations")

        tx = None
        try:
            async with self.pool.acquire() as connection:
                tx = connection.transaction()
                await tx.start()

                saved_images = []
                for image in images:
                    # TODO: Move to separated function
                    if not image.startswith("data:image"):
                        raise IncorrectImageType

                    if "," in image:
                        image = image.split(",")[1]

                    image_data_base64 = base64.b64decode(image)

                    fileid = uuid4()

                    filename = f"{fileid}.jpg"

                    filepath = f"{cfg_obj.UPLOAD_DIR}/{filename}"

                    async with aiofiles.open(filepath, "wb") as buffer:
                        await buffer.write(image_data_base64)

                    await connection.execute(
                        "INSERT INTO stories_images (story_id, path) VALUES ($1, $2)",
                        story_id,
                        filename,
                    )

                    saved_images.append(filename)

                    # TODO: change to logger
                    print(f"Saved image: {filename} for story #{story_id}")

                await tx.commit()
                return saved_images

        except IncorrectImageType:
            if tx:
                await tx.rollback()
            raise
        except Exception as e:
            # TODO: change to logger
            print(f"Error saving image for post #{story_id}: {e} - {type(e)}")
            if tx:
                await tx.rollback()
            return None

    async def get_stories_requests(
        self, limit: int, offset: int, status: str
    ) -> List[FullStory]:
        stmt = """SELECT
    s.id,
    s.author_id,
    s.title,
    s.content,
    s.status,
    s.created_at,
    s.updated_at,
    (SELECT name FROM users WHERE id = s.author_id) AS name,
    (SELECT surname FROM users WHERE id = s.author_id) AS surname,
    COALESCE(array_agg(DISTINCT si.path) FILTER (WHERE si.path IS NOT NULL), '{}') AS images,
    COALESCE(array_agg(DISTINCT at.name) FILTER (WHERE at.name IS NOT NULL), '{}') AS tags
FROM 
    stories AS s
LEFT JOIN stories_images AS si ON s.id = si.story_id
LEFT JOIN stories_tags AS st ON s.id = st.story_id
LEFT JOIN available_tags AS at ON st.tag_id = at.id
WHERE 
    s.status = $1
GROUP BY 
    s.id
ORDER BY 
    s.created_at DESC
LIMIT $2 OFFSET $3;
"""

        stories = await self.db.fetch(
            stmt,
            status,
            limit,
            offset,
        )

        result = []

        for story in stories:
            story_as_dict = dict(story)
            author = StoryAuthor(
                id=story_as_dict.get("author_id"),
                name=story_as_dict.get("name"),
                surname=story_as_dict.get("surname"),
            )
            result.append(FullStory(**story_as_dict, author=author))

        return result

    async def update_story_status(
        self, story_id: int, new_status: str, admin_id: str
    ) -> bool:
        await self.db.execute(
            "UPDATE stories SET status=$1, updated_by=$2 WHERE id=$3",
            new_status,
            admin_id,
            story_id,
        )

        return True

    async def get_stories(self, limit: int, offset: int) -> List[FullStory]:
        stmt = """SELECT
    s.id,
    s.author_id,
    s.title,
    s.content,
    s.created_at,
    (SELECT name FROM users WHERE id = s.author_id) AS name,
    (SELECT surname FROM users WHERE id = s.author_id) AS surname,
    COALESCE(array_agg(DISTINCT si.path) FILTER (WHERE si.path IS NOT NULL), '{}') AS images,
    COALESCE(array_agg(DISTINCT at.name) FILTER (WHERE at.name IS NOT NULL), '{}') AS tags
FROM 
    stories AS s
LEFT JOIN stories_images AS si ON s.id = si.story_id
LEFT JOIN stories_tags AS st ON s.id = st.story_id
LEFT JOIN available_tags AS at ON st.tag_id = at.id
WHERE 
    s.status = $1
GROUP BY 
    s.id
ORDER BY 
    s.created_at DESC
LIMIT $2 OFFSET $3;
"""

        records = await self.db.fetch(stmt, STORY_STATUS.APPROVED.value, limit, offset)

        result = []

        for record in records:
            record_as_dict = dict(record)
            author = StoryAuthor(
                id=record_as_dict.get("author_id"),
                name=record_as_dict.get("name"),
                surname=record_as_dict.get("surname"),
            )
            story = ReadableStory(author=author, **record_as_dict)

            result.append(story)

        return result
