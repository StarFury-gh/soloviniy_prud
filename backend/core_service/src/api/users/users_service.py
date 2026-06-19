from fastapi import HTTPException, status

from jwt import encode, decode
from jwt.exceptions import DecodeError
from hashlib import sha256

from core.config import cfg_obj

from .users_repository import UsersRepository
from .users_schemas import (
    LoginUserDTO,
    RegisterUserDTO,
    CreateAdminDTO,
    USERS_ROLES,
    AuthUserResponse,
)
from .users_exceptions import UserAlreadyExists, UserNotFound


class UsersService:
    def __init__(self, repo: UsersRepository) -> None:
        self.repo = repo

    def __encode_jwt(self, payload: dict[str, str]) -> str:
        return encode(payload=payload, key=cfg_obj.JWT_SECRET_KEY, algorithm="HS256")  # type: ignore

    def __decode_jwt(self, jwt: str) -> dict:
        return decode(jwt=jwt, key=cfg_obj.JWT_SECRET_KEY, algorithms=["HS256"])  # type: ignore

    def __get_hash(self, value: str) -> str:
        return sha256(value.encode("utf-8")).hexdigest()

    async def get_all_users(self):
        users = await self.repo.get_all_users()
        return {"users": users}

    async def login_user(self, body: LoginUserDTO):
        hashed_password = self.__get_hash(body.password)

        try:
            user = await self.repo.login_user(
                email=body.email, password=hashed_password
            )

            jwt = self.__encode_jwt(
                {"id": str(user.id), "email": user.email, "role": user.role}
            )
            jwt = f"Bearer {jwt}"

            return {"access_token": jwt}

        except UserNotFound:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        except HTTPException as e:
            raise e

        except Exception as e:
            # TODO: change to logger
            print("Login user error:", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def auth_admin(self, authorization: str) -> AuthUserResponse:
        if not authorization.startswith("Bearer"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
            )

        jwt = authorization.split("Bearer ")[1]

        payload = self.__decode_jwt(jwt)
        user_id = payload.get("id")

        try:
            role = await self.repo.get_user_role(user_id=user_id)  # type: ignore
            if role != USERS_ROLES.ADMIN.value:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden for you"
                )

            return AuthUserResponse(**payload)

        except UserNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

    async def register_user(self, body: RegisterUserDTO):
        hashed_password = self.__get_hash(body.password)

        try:
            user = await self.repo.register_user(
                email=body.email,
                password=hashed_password,
                name=body.name,
                surname=body.surname,
                avatar_path="./avatar.png",
                role=USERS_ROLES.USER.value,
            )

            jwt = self.__encode_jwt(
                {"id": str(user.id), "email": user.email, "role": user.role}
            )
            jwt = f"Bearer {jwt}"

            return {"access_token": jwt}

        except UserAlreadyExists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="User already exists"
            )

        except Exception as e:
            # TODO: change to logger
            print("Login user error:", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def create_admin(self, body: CreateAdminDTO):
        hashed_password = self.__get_hash(body.password)

        try:
            await self.repo.create_admin(
                email=body.email,
                password=hashed_password,
                name=body.name,
                surname=body.surname,
                avatar=body.avatar,
            )
        except UserAlreadyExists:
            # TODO: change to logger
            print("Admin already exists.")
        except Exception as e:
            # TODO: change to logger
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def auth_user(self, authorization: str) -> AuthUserResponse:
        if not authorization.startswith("Bearer"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
            )

        jwt = authorization.split("Bearer ")[1]

        try:
            payload = self.__decode_jwt(jwt)
            return AuthUserResponse(**payload)

        except DecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
            )

    async def get_user_info(self, id: str):
        try:
            user_info = await self.repo.get_user_info(id)
            return {"info": user_info}

        except UserNotFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
