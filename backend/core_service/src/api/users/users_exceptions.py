class BaseUserException(BaseException):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class UserAlreadyExists(BaseUserException):
    def __init__(
        self,
    ) -> None:
        message: str = "Пользователь уже зарегистрирован"
        super().__init__(message)


class UserNotFound(BaseUserException):
    def __init__(self) -> None:
        message: str = "Пользователь не найден"
        super().__init__(message)


class MaxVerificationAttempts(BaseUserException):
    def __init__(self):
        message = "Максильное количество попыток авторизации, попробуйте позже"
        super().__init__(message)
