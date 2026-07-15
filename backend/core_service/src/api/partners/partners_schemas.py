from pydantic import BaseModel
from typing import List
from uuid import UUID
from enum import Enum
from datetime import datetime


class PartnerRequestStatus(Enum):
    NEW = "new"
    APPROVED = "approved"
    REJECTED = "rejected"


class Social(BaseModel):
    social: str
    url: str


class BasePartner(BaseModel):
    name: str
    description: str
    photos: List[str]
    socials: List[Social]


class Partner(BasePartner):
    id: str | UUID


class CreatePartnerDTO(BaseModel):
    name: str
    description: str
    photos: List[str]


class UpdatePartnerDTO(BaseModel):
    pass


class CreatePartnerRequestDTO(BasePartner):
    pass


class PartnerRepresentative(BaseModel):
    id: UUID | str
    name: str
    surname: str


class UpdatePartnerStatus(BaseModel):
    new_status: PartnerRequestStatus


class PartnerRequest(Partner):
    status: PartnerRequestStatus
    representatives: List[PartnerRepresentative]
    trusted: bool
    docs: List[str]
    created_at: datetime
