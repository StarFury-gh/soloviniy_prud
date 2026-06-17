from fastapi import APIRouter, File, UploadFile, Depends

from .service import PlantsService
from .dependencies import get_plants_service, Pagination
from .model import get_predict
from .schemas import UpdatePlantTranslationDTO

plants_router = APIRouter(prefix="/plants", tags=["identify"])


@plants_router.post("/identify")
async def identify_by_image(image: UploadFile = File(...)):
    return await get_predict(image)


@plants_router.get("/")
async def get_registered_plants(
    service: PlantsService = Depends(get_plants_service),
    pagination: Pagination = Depends(Pagination),
):
    return await service.get_registered_plants(
        limit=pagination.limit, offset=pagination.offset
    )


@plants_router.patch("/update_translation")
async def update_plant_translation(
    body: UpdatePlantTranslationDTO,
    service: PlantsService = Depends(get_plants_service),
):
    return await service.update_plant_translation(
        class_id=body.class_id, new_ru_name=body.new_ru_name
    )
