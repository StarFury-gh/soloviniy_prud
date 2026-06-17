from abc import ABC, abstractmethod
from typing import List

from .schemas import Plant


class ABCPlantsRepository(ABC):
    def __init__(self, db) -> None:
        super().__init__()

    @abstractmethod
    def get_registered_plants(self, limit: int, offset: int) -> List[Plant]:
        pass

    @abstractmethod
    def update_plant_translation(self, class_id: int, new_ru_name: str) -> Plant | None:
        pass
