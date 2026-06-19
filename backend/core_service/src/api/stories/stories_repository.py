from asyncpg import Connection
from asyncpg.exceptions import ForeignKeyViolationError
import aiofiles

from typing import List

import base64
from uuid import uuid4

from core.config import cfg_obj

from api.users.users_exceptions import UserNotFound

from .stories_exceptions import IncorrectImageType

from .stories_schemas import Story, StoryTag, STORY_STATUS


class StoriesRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def create_story_tag(self, tag_name: str) -> StoryTag:
        tag_id = await self.db.fetchval(
            "INSERT INTO available_tags (name) VALUES ($1) RETURNING id", tag_name
        )
        return StoryTag(id=tag_id, name=tag_name)

    async def get_all_stories_tags(self) -> List[StoryTag]:
        tags = await self.db.fetch("SELECT id, name FROM available_tags")
        tags = [StoryTag(**dict(tag)) for tag in tags]
        return tags

    async def save_story(
        self, title: str, author_id: str, tags_ids: List[int], content: str
    ) -> Story | None:
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

    async def save_story_images(
        self, images: List[str], story_id: int
    ) -> List[str | None] | None:
        tx = self.db.transaction()
        await tx.start()
        try:
            saved_images = []
            for image in images:
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

                await self.db.execute(
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
            await tx.rollback()
            raise
        except Exception as e:
            # TODO: change to logger
            print(f"Error saving image for post #{story_id}: {e} - {type(e)}")
            await tx.rollback()
            return None
