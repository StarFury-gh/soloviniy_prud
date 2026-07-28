from core.config import cfg_obj


class EmailClient:
    def __init__(self):
        self.SMTP_SECRET_CODE = cfg_obj.SMTP_SECRET_CODE
