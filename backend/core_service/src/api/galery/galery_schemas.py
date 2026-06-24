from pydantic import BaseModel

from typing import List
from uuid import UUID


class GaleryPhotoAuthor(BaseModel):
    id: str | UUID
    name: str
    surname: str


class GaleryPhoto(BaseModel):
    id: int
    author: GaleryPhotoAuthor
    path: str


class GaleryPublication(BaseModel):
    publishing_id: str | UUID
    author: GaleryPhotoAuthor
    photos: List[str]


class AddGaleryPhotosDTO(BaseModel):
    # Base64 photos
    photos: List[str]
