class BasePartnerException(BaseException):
    def __init__(self, message: str):
        super().__init__(message)


class IncorrectImageType(BasePartnerException):
    def __init__(self):
        message = "Incorrect image type"
        super().__init__(message)


class PartnerAlreadyExists(BasePartnerException):
    def __init__(self):
        message = "Partner with this name already exists."
        super().__init__(message)


class PartnerNotFound(BasePartnerException):
    def __init__(self):
        message = "Partner not found"
        super().__init__(message)


class UserIsNotRepresentative(BasePartnerException):
    def __init__(self):
        message = "User is not representative of partner"
        super().__init__(message)
