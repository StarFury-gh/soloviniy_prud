from fastapi import HTTPException, status

from api.users.users_exceptions import UserNotFound

from .stories_repository import StoriesRepository
from .stories_schemas import CreateStoryDTO, CreateStoryTagDTO


class StoriesService:
    def __init__(self, repo: StoriesRepository) -> None:
        self.repo = repo

    async def get_all_tags(self):
        tags = await self.repo.get_all_stories_tags()
        return {"tags": tags}

    async def create_tag(self, body: CreateStoryTagDTO):
        created_story_tag = await self.repo.create_story_tag(tag_name=body.name)
        return {"created": created_story_tag}

    async def create_story(self, body: CreateStoryDTO, author_id: str):
        try:
            # Сохранить текстовую информацию о посте
            story = await self.repo.save_story(
                title=body.title,
                author_id=author_id,
                tags_ids=body.tags,
                content=body.content,
            )

            if story is not None:
                print(f"Saving photos for story: #{story.id}")
                await self.repo.save_story_images(body.images, story_id=story.id)

            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Internal server error.",
                )

            return {"status": "Story Created"}
        except UserNotFound:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
            )
