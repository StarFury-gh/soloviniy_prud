class BaseStoryException(BaseException):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class TagAlreadyExists(BaseStoryException):
    def __init__(self) -> None:
        self.message = "Тег уже существует"
        super().__init__(self.message)


class TagIsNotExists(BaseStoryException):
    def __init__(self) -> None:
        self.message = "Тег не найден"
        super().__init__(self.message)


class IncorrectImageType(BaseStoryException):
    def __init__(self) -> None:
        message = "Передан неверный формат файла"
        super().__init__(message)
