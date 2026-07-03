import os
from dotenv import load_dotenv


class Config:
    def __init__(self):
        load_dotenv()

        self._ENV_TYPE = os.getenv("ENV_TYPE")
        self.SERVER_HOST = os.getenv("SERVER_HOST") or "0.0.0.0"
        self.SERVER_PORT = int(os.getenv("SERVER_PORT") or 8001)

        if self._ENV_TYPE != "prod":
            self.API_URL = "http://localhost:8000"

        else:
            self.API_URL = os.getenv("API_URL")


cfg_obj = Config()
