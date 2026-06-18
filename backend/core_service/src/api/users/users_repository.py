from asyncpg import Connection
from asyncpg.exceptions import UniqueViolationError

from typing import List

from .users_exceptions import UserAlreadyExists, UserNotFound
from .users_schemas import User, USERS_ROLES, GetUser


class UsersRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def login_user(self, email: str, password: str) -> User:
        user = await self.db.fetchrow(
            "SELECT id, name, surname, role, avatar FROM users WHERE email=$1 AND password=$2",
            email,
            password,
        )

        if user is not None:
            user = dict(user)
            user["id"] = str(user.get("id"))
            return User(**user, email=email, password=password)

        raise UserNotFound

    async def get_all_users(self) -> List[User]:
        users = await self.db.fetch("SELECT * FROM users")
        users = [User(**(dict(user))) for user in users]
        return users

    async def get_user_role(self, user_id: str) -> str | None:
        user = await self.db.fetchrow("SELECT role FROM users WHERE id=$1", user_id)
        if user is not None:
            user = dict(user)
            return user.get("role")

        raise UserNotFound

    async def register_user(
        self,
        email: str,
        password: str,
        name: str,
        surname: str,
        role: str,
        avatar_path: str | None,
    ) -> User:
        try:
            new_user_id = await self.db.fetchval(
                "INSERT INTO users (email, password, name, surname, role, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
                email,
                password,
                name,
                surname,
                role,
                avatar_path,
            )

            return User(
                email=email,
                password=password,
                name=name,
                surname=surname,
                id=str(new_user_id),
                role=role,
                avatar=avatar_path,
            )

        except UniqueViolationError:
            raise UserAlreadyExists

    async def create_admin(
        self, email: str, password: str, name: str, surname: str, avatar: str
    ) -> User:
        try:
            new_user_id = await self.db.fetchval(
                "INSERT INTO users (email, password, name, surname, role, avatar) VALUES ($1, $2, $3, $4, $5, $6)",
                email,
                password,
                name,
                surname,
                USERS_ROLES.ADMIN.value,
                avatar,
            )
            return User(
                id=str(new_user_id),
                role=USERS_ROLES.ADMIN.value,
                email=email,
                password=password,
                name=name,
                surname=surname,
                avatar=avatar,
            )
        except UniqueViolationError:
            raise UserAlreadyExists

    async def get_user_info(self, id: str) -> GetUser:
        user = await self.db.fetchrow(
            "SELECT id, email, name, surname, role, avatar FROM users WHERE id=$1", id
        )
        if user is not None:
            user = dict(user)
            return GetUser(**user)

        raise UserNotFound
