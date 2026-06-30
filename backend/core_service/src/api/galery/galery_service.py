from fastapi import HTTPException, status

from api.users.users_schemas import AuthUserResponse

from .galery_schemas import AddGaleryPhotosDTO
from .galery_repository import GaleryRepository
from .galery_exceptions import AuthorNotFound, PublicationNotFound


class GaleryService:
    def __init__(self, repo: GaleryRepository) -> None:
        self.repo = repo

    async def get_photos(self, limit: int, offset: int):
        photos = await self.repo.get_photos(limit=limit, offset=offset)
        return {"publications": photos}

    async def add_photos(
        self, body: AddGaleryPhotosDTO, authorization: AuthUserResponse
    ):
        photos = body.photos

        if photos == []:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Empty photos list"
            )
        try:
            saved = await self.repo.add_photos(
                photos=photos, user_id=authorization.id, user_role=authorization.role
            )
            return {"saved": saved, "status": True}

        except AuthorNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Author not found"
            )

    async def get_photos_requests(self, limit: int, offset: int, status: str):
        result = await self.repo.get_photos_requests(
            limit=limit, offset=offset, status=status
        )

        return {"requests": result}

    async def update_publication_status(self, publishing_id: str, new_status: str):
        try:
            await self.repo.update_publication_status(
                publishing_id=publishing_id, new_status=new_status
            )
            return {"updated": True}
        except PublicationNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found"
            )
        except Exception as e:
            print(e)
            return HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )
