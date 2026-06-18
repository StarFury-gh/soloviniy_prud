from pydantic import BaseModel

from uuid import UUID

from enum import Enum


class LoginUserDTO(BaseModel):
    email: str
    password: str


class RegisterUserDTO(BaseModel):
    email: str
    password: str
    name: str
    surname: str
    avatar: str  # Base64


class CreateAdminDTO(BaseModel):
    email: str
    password: str
    name: str
    surname: str
    avatar: str = "admin_avatar.png"  # Base64


class User(BaseModel):
    id: str | UUID
    email: str
    password: str
    name: str
    surname: str
    avatar: str | None  # Путь
    role: str


class USERS_ROLES(Enum):
    ADMIN = "admin"
    USER = "user"
