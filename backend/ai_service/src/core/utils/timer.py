import time
from functools import wraps

from logging import getLogger

logger = getLogger(__name__)


def timer(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = await func(*args, **kwargs)
        end = time.perf_counter()
        logger.info(f"Function: {func.__name__} was ended: {end-start:.4f} sec")
        return result

    return wrapper
