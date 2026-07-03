from fastapi import Header, HTTPException, status
import httpx

from core.config import cfg_obj
from functools import lru_cache

from .schemas import UsersRoles, AuthUserResponse


@lru_cache
def require_admin(
    authorization: str = Header(..., alias="Authorization")
) -> AuthUserResponse:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Authorization required"
        )

    if not authorization.startswith("Bearer"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
        )

    url = f"{cfg_obj.API_URL}/users/auth"

    response = httpx.get(url, headers={"Authorization": authorization})

    response = response.json()
    role = response.get("role")

    if role != UsersRoles.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden for you"
        )

    return AuthUserResponse(**response)
