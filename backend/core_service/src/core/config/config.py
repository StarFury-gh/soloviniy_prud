from dotenv import load_dotenv
from os import getenv


class Config:
    def __init__(self) -> None:
        load_dotenv()

        self.ENV_TYPE = getenv("ENV_TYPE")

        if self.ENV_TYPE != "prod":
            self.PG_HOST = "localhost"
            self.PG_PORT = 5432
            self.PG_USER = "postgres"
            self.PG_PASSWORD = "postgres"
            self.PG_DB = "soloviniy_prud"

        else:
            self.PG_HOST = getenv("PG_HOST")
            self.PG_PORT = getenv("PG_PORT")
            self.PG_USER = getenv("PG_USER")
            self.PG_PASSWORD = getenv("PG_PASSWORD")
            self.PG_DB = getenv("PG_DB")

        self.PG_DSN = f"postgres://{self.PG_USER}:{self.PG_PASSWORD}@{self.PG_HOST}:{self.PG_PORT}/{self.PG_DB}"

        self.APP_PORT = int(getenv("APP_PORT") or 8000)

        self.JWT_SECRET_KEY = getenv("JWT_SECRET_KEY")

        self.ADMIN_EMAIL = getenv("ADMIN_EMAIL")
        self.ADMIN_NAME = getenv("ADMIN_NAME")
        self.ADMIN_PASSWORD = getenv("ADMIN_PASSWORD")
        self.ADMIN_SURNAME = getenv("ADMIN_SURNAME")

        self.UPLOAD_DIR = "./saved/stories"


cfg_obj = Config()
