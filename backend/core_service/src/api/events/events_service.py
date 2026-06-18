from .events_repository import EventsRepository

class EventsService:
    def __init__(self, repo: EventsRepository) -> None:
        self.repo = repo
