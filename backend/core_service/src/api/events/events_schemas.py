from pydantic import BaseModel
from enum import Enum

from typing import List

from uuid import UUID
from datetime import datetime


class EVENT_STATUS(Enum):
    PAST = "past"
    FUTURE = "future"


class Event(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime
    updated_at: datetime
    created_by: str | UUID
    date: datetime
    images: List[str] = []


class CreateEventDTO(BaseModel):
    name: str
    description: str
    date: datetime
    images: List[str] = []


class UpdateEventDTO(BaseModel):
    new_name: str | None = None
    new_description: str | None = None
    new_date: datetime | None = None
