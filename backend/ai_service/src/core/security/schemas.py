from pydantic import BaseModel
from enum import Enum
from uuid import UUID


class UsersRoles(Enum):
    ADMIN = "admin"
    USER = "user"


class AuthUserResponse(BaseModel):
    id: str | UUID
    email: str
    role: UsersRoles
