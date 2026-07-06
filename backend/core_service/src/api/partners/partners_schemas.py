from pydantic import BaseModel
from typing import List
from uuid import UUID


class Partner(BaseModel):
    id: str | UUID
    name: str
    description: str
    photos: List[str]


class CreatePartnerDTO(BaseModel):
    name: str
    description: str
    photos: List[str]


class UpdatePartnerDTO(BaseModel):
    pass
