from asyncpg import Connection
from asyncpg.exceptions import UniqueViolationError

from typing import List

from .users_exceptions import UserAlreadyExists, UserNotFound
from .users_schemas import User, USERS_ROLES


class UsersRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def get_user_by_email(self, email: str) -> User | None:
        user = await self.db.fetchrow(
            "SELECT id, email, name, role FROM users WHERE email=$1", email
        )

        if user is None:
            return None

        user = dict(user)

        return User(**user)

    async def create_temp_user(self, name: str, email: str) -> User:
        user = await self.db.fetchrow(
            "INSERT INTO users (name, email, role, verified) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role",
            name,
            email,
            USERS_ROLES.USER.value,
            False,
        )

        return User(**dict(user))

    async def get_user_verifications(self, email: str) -> list[str]:
        codes = await self.db.fetch(
            "SELECT code FROM verification WHERE email = $1 AND created_at > NOW() - INTERVAL '10 minutes'",
            email,
        )

        codes = [dict(code).get("code") for code in codes]

        return codes

    async def save_user_verification_code(self, email: str, code: str):
        await self.db.execute(
            "INSERT INTO verification (email, code) VALUES ($1, $2)", email, code
        )

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

    async def create_admin(self, email: str, name: str) -> User:
        try:
            new_user_id = await self.db.fetchval(
                "INSERT INTO users (email, name, role) VALUES ($1, $2, $3)",
                email,
                name,
                USERS_ROLES.ADMIN.value,
            )
            return User(
                id=str(new_user_id),
                role=USERS_ROLES.ADMIN.value,
                email=email,
                name=name,
            )
        except UniqueViolationError:
            raise UserAlreadyExists

    async def get_user_info(self, id: str) -> User:
        user = await self.db.fetchrow(
            "SELECT id, email, name, role FROM users WHERE id=$1", id
        )
        if user is not None:
            user = dict(user)
            return User(**user)

        raise UserNotFound

    async def verify_user(self, email: str):
        await self.db.execute(
            "UPDATE users SET verified=$1 WHERE email=$2", True, email
        )

    async def get_admin(self, email: str) -> User:
        user = await self.db.fetchrow(
            "SELECT id, name, email, role FROM users WHERE email=$1 AND role=$2",
            email,
            USERS_ROLES.ADMIN.value,
        )

        if user is not None:
            return User(**dict(user))

        return None
