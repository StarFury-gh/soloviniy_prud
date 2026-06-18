from .events_repository import EventsRepository
from .events_service import EventsService

def get_db():
    # TODO: подключить реальную БД
    return None

def get_repository(db = get_db()):
    return EventsRepository(db)

def get_service(repo = get_repository()):
    return EventsService(repo)
