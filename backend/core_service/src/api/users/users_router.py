from fastapi import APIRouter, Depends, Header

from .users_service import UsersService
from .users_dependencies import get_service, admin_required, auth_required
from .users_schemas import LoginUserDTO, RegisterUserDTO

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.post("/login")
async def login_user(body: LoginUserDTO, service: UsersService = Depends(get_service)):
    return await service.login_user(body=body)


@users_router.post("/register")
async def register_user(
    body: RegisterUserDTO, service: UsersService = Depends(get_service)
):
    return await service.register_user(body=body)


@users_router.get("/auth")
async def auth_user(
    authorization=Header(..., alias="Authorization"),
    service: UsersService = Depends(get_service),
):
    return await service.auth_user(authorization=authorization)


@users_router.get("/get_info")
async def get_info(
    auth=Depends(auth_required), service: UsersService = Depends(get_service)
):
    return await service.get_user_info(auth.id)


@users_router.get("/all")
async def get_all_users(
    _=Depends(admin_required), service: UsersService = Depends(get_service)
):
    return await service.get_all_users()
