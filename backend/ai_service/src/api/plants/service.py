from fastapi import HTTPException, status

from .abc_plants_repo import ABCPlantsRepository


class PlantsService:
    def __init__(self, repo: ABCPlantsRepository) -> None:
        self._repo = repo

    async def get_registered_plants(self, limit: int, offset: int):
        return self._repo.get_registered_plants(limit=limit, offset=offset)

    async def update_plant_translation(self, class_id: int, new_ru_name: str):
        updated_plant = self._repo.update_plant_translation(
            class_id=class_id, new_ru_name=new_ru_name
        )

        if updated_plant is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Plant is not found."
            )

        return {"updated": updated_plant}
