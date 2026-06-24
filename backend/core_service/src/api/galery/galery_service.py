from fastapi import HTTPException, status

from uuid import UUID

from .galery_schemas import AddGaleryPhotosDTO
from .galery_repository import GaleryRepository
from .galery_exceptions import AuthorNotFound


class GaleryService:
    def __init__(self, repo: GaleryRepository) -> None:
        self.repo = repo

    async def get_photos(self, limit: int, offset: int):
        images = await self.repo.get_photos(limit=limit, offset=offset)
        return {"images": images}

    async def add_photos(self, body: AddGaleryPhotosDTO, user_id: str | UUID):
        photos = body.photos

        if photos == []:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Empty images list"
            )
        try:
            saved = await self.repo.add_photos(photos=photos, user_id=user_id)
            return {"saved": saved, "status": True}

        except AuthorNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Author not found"
            )
