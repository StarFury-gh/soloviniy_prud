class BaseGaleryException(BaseException):
    def __init__(self, message: str):
        super().__init__(message)


class AuthorNotFound(BaseGaleryException):
    def __init__(self):
        message = "Author not found"
        super().__init__(message)


class IncorrectImageType(BaseGaleryException):
    def __init__(self):
        message = "Incorrect image type"
        super().__init__(message)
