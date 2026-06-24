from pydantic import BaseModel
from typing import List
from datetime import datetime
from enum import Enum
from uuid import UUID


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


class StoryAuthor(BaseModel):
    id: UUID | str
    name: str
    surname: str


class ReadableStory(BaseModel):
    id: int
    author: StoryAuthor
    content: str
    created_at: datetime | None = None
    tags: List[str]
    images: List[str | None]


class FullStory(BaseModel):
    id: int
    author_id: str | UUID
    title: str
    content: str
    status: STORY_STATUS
    created_at: datetime | None = None
    updated_at: datetime | None = None
    tags: List[str]
    author: StoryAuthor
    # Список путей до картинок
    images: List[str | None]


class CreateStoryDTO(BaseModel):
    title: str
    # Список id тегов
    tags: List[int]
    content: str
    # Список картинок в Base64
    images: List[str]
