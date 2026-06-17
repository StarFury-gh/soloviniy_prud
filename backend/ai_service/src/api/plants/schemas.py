from pydantic import BaseModel
from typing import List


class PlantPredict(BaseModel):
    lat_name: str
    ru_name: str
    class_id: int
    probability: int | float


class Plant(BaseModel):
    id: int
    lat_name: str
    ru_name: str


class PredictResponse(BaseModel):
    predictions: List[PlantPredict]


class UpdatePlantTranslationDTO(BaseModel):
    class_id: int
    new_ru_name: str
