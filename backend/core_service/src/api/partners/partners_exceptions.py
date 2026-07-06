class BasePartnerException(BaseException):
    def __init__(self, message: str):
        super().__init__(message)


class IncorrectImageType(BasePartnerException):
    def __init__(self):
        message = "Incorrect image type"
        super().__init__(message)
