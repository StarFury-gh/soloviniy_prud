class BaseEventException(BaseException):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class IncorrectEventStatus(BaseEventException):
    def __init__(self) -> None:
        message = "Неверный статус события."
        super().__init__(message)


class EventNotFound(BaseEventException):
    def __init__(self) -> None:
        message = "Событие не найдено"
        super().__init__(message)


class EmptyEventUpdate(BaseEventException):
    def __init__(self) -> None:
        message = "Невозможно обновить событие на пустые значения"
        super().__init__(message)
