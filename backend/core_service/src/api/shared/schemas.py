from pydantic import BaseModel

from .constants import PAGINATION_LIMIT, PAGINATION_OFFSET


class Pagination(BaseModel):
    limit: int = PAGINATION_LIMIT
    offset: int = PAGINATION_OFFSET
