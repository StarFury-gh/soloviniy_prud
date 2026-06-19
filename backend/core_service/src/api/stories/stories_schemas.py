from pydantic import BaseModel
from typing import List
from datetime import datetime
from enum import Enum


class STORY_STATUS(Enum):
    NEW = "new"
    APPROVED = "approved"
    REJECTED = "rejected"


class StoryTag(BaseModel):
    id: int
    name: str


class CreateStoryTagDTO(BaseModel):
    name: str


class Story(BaseModel):
    id: int
    author_id: str
    title: str
    tags: List[int]
    content: str
    status: STORY_STATUS
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CreateStoryDTO(BaseModel):
    title: str
    # Список id тегов
    tags: List[int]
    content: str
    # Список картинок в Base64
    images: List[str]
