import logging
from typing import Optional

INFO = "INFO"
DEBUG = "DEBUG"


def __define_logging_level() -> str:
    return INFO


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """Фабрика для получения настроенного логгера"""
    logger = logging.getLogger(name or __name__)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(levelname)s: %(asctime)s - %(name)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        level = __define_logging_level()
        logger_level = None

        if level == INFO:
            logger_level = logging.INFO
        elif level == DEBUG:
            logger_level = logging.DEBUG

        logger.setLevel(logger_level)

    return logger
