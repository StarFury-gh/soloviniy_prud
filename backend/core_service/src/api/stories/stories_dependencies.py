from .stories_repository import StoriesRepository
from .stories_service import StoriesService

def get_db():
    # TODO: подключить реальную БД
    return None

def get_repository(db = get_db()):
    return StoriesRepository(db)

def get_service(repo = get_repository()):
    return StoriesService(repo)
