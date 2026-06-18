from .stories_repository import StoriesRepository

class StoriesService:
    def __init__(self, repo: StoriesRepository) -> None:
        self.repo = repo
