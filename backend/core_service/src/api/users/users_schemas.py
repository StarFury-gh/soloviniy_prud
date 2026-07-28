from pydantic import BaseModel, EmailStr

from uuid import UUID

from enum import Enum


class LoginUserDTO(BaseModel):
    email: EmailStr


class RegisterUserDTO(BaseModel):
    email: EmailStr
    name: str


class VerifyUserDTO(BaseModel):
    email: EmailStr
    code: str


class User(BaseModel):
    id: str | UUID
    email: str
    name: str
    role: str


class GetUser(BaseModel):
    id: str | UUID
    email: str
    name: str
    surname: str
    avatar: str | None  # Путь
    role: str


class USERS_ROLES(Enum):
    ADMIN = "admin"
    USER = "user"


class VerificationEmailType(Enum):
    REGISTRATION = "register"
    LOGIN = "login"


class AuthUserResponse(BaseModel):
    id: str | UUID
    email: str
    role: str
