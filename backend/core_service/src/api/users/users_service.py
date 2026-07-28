from fastapi import HTTPException, status

from jwt import encode, decode
from jwt.exceptions import DecodeError
from hashlib import sha256
from logging import Logger
import secrets

from core.config import cfg_obj
from core.clients.email import EmailClient
from core.constants import (
    REGISTER_VERIFICATION_CODE_MESSAGE_TEMPLATE,
    LOGIN_VERIFICATION_CODE_MESSAGE_TEMPLATE,
    VERIFICATION_EMAIL_SUBJECT,
    MAX_VERIFICATION_ATTEMPTS,
)

from .users_repository import UsersRepository
from .users_schemas import (
    LoginUserDTO,
    RegisterUserDTO,
    CreateAdminDTO,
    USERS_ROLES,
    AuthUserResponse,
    VerifyUserDTO,
    VerificationEmailType,
)
from .users_exceptions import (
    UserAlreadyExists,
    UserNotFound,
    MaxVerificationAttempts,
    BaseUserException,
)


class UsersService:
    def __init__(self, repo: UsersRepository, logger: Logger) -> None:
        self.repo = repo
        self.logger = logger

    def __encode_jwt(self, payload: dict[str, str]) -> str:
        return encode(payload=payload, key=cfg_obj.JWT_SECRET_KEY, algorithm="HS256")  # type: ignore

    def __decode_jwt(self, jwt: str) -> dict:
        return decode(jwt=jwt, key=cfg_obj.JWT_SECRET_KEY, algorithms=["HS256"])  # type: ignore

    def __get_hash(self, value: str) -> str:
        return sha256(value.encode("utf-8")).hexdigest()

    def __generate_verification_code(self, length: int = 5) -> str:
        if length < 1:
            raise ValueError("Code length cannot be less than 1")

        code = "".join(str(secrets.randbelow(10)) for i in range(length))

        return code

    async def __user_exists(self, email: str) -> bool:
        user = await self.repo.get_user_by_email(email)
        if user:
            return True
        return False

    def __get_message_with_code(self, code: str, type: VerificationEmailType) -> str:
        if type == VerificationEmailType.REGISTRATION.value:
            return REGISTER_VERIFICATION_CODE_MESSAGE_TEMPLATE.substitute(code=code)
        else:
            return LOGIN_VERIFICATION_CODE_MESSAGE_TEMPLATE.substitute(code=code)

    async def _write_temp_user(self, name: str, email: str):
        self.logger.info(f"Temporary saving user: {email}")
        await self.repo.create_temp_user(name=name, email=email)

    async def _save_code_for_user(self, email: str, code: str):
        self.logger.info(f"Saving user verification code for: {email}")
        users_verifications = await self.repo.get_user_verifications(email=email)
        if len(users_verifications) > MAX_VERIFICATION_ATTEMPTS:
            raise MaxVerificationAttempts
        await self.repo.save_user_verification_code(email=email, code=code)

    async def _send_verification_email(
        self, email: str, code: str, type: VerificationEmailType
    ):
        emc = EmailClient()

        msg = self.__get_message_with_code(code=code, type=type)

        emc.send_email(
            email,
            msg=msg,
            subject=VERIFICATION_EMAIL_SUBJECT,
        )

    async def get_all_users(self):
        users = await self.repo.get_all_users()
        return {"users": users}

    async def login_user(self, body: LoginUserDTO):
        try:
            existence = await self.__user_exists(email=body.email)
            if not existence:
                raise UserNotFound

            code = self.__generate_verification_code()
            await self._save_code_for_user(email=body.email, code=code)
            await self._send_verification_email(
                body.email, code=code, type=VerificationEmailType.LOGIN.value
            )

            return {"status": True}

        except UserNotFound:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Пользователь не найден.",
            )

        except HTTPException as e:
            raise e

        except Exception as e:
            self.logger.error("Login user error:", e)
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
        try:
            existence = await self.__user_exists(body.email)
            if existence:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Пользователь с таким email уже существует. Войдите в аккаунт.",
                )

            await self._write_temp_user(name=body.name, email=body.email)
            code = self.__generate_verification_code()
            await self._save_code_for_user(email=body.email, code=code)
            await self._send_verification_email(
                body.email, code=code, type=VerificationEmailType.REGISTRATION.value
            )

            return {"message": "Registration started. Check email"}

        except HTTPException as e:
            raise e

        except Exception as e:
            self.logger.error(f"RegisterUser error: {e} - {type(e)}")
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
            self.logger.debug("Admin already exists.")
        except Exception as e:
            self.logger.error(e)
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

    async def verify_user(self, body: VerifyUserDTO):
        try:
            code = body.code
            email = body.email

            verification_codes = await self.repo.get_user_verifications(email=email)
            verification_codes = set(verification_codes)

            if code in verification_codes:
                user = await self.repo.get_user_by_email(email)
                token = self.__encode_jwt(
                    {"id": str(user.id), "email": user.email, "role": user.role}
                )
                await self.repo.verify_user(email=email)
                return {"status": True, "access_token": f"Bearer {token}"}

            return {"status": False, "message": "Неверный код"}

        except Exception as e:
            self.logger.error("Verify user error:", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )
