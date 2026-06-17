from fastapi import UploadFile, HTTPException, status

from transformers import AutoImageProcessor, AutoModelForImageClassification
import os
import json
import torch
import io
import logging

from PIL import Image

from translation import translate_plant_name

from .schemas import PlantPredict, PredictResponse

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)


PREDICTIONS_COUNT = 3
FLOAT_LEN_AFTER_DOT = 4

processor = None
model = None
device = None
id2label = None


async def load_model():
    """Инициализация и загрузка модели для распознания растений по фотографиям."""
    global processor, model, device, id2label

    local_model_path = "./models/identifier"
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    processor = AutoImageProcessor.from_pretrained(
        local_model_path, local_files_only=True
    )
    model = AutoModelForImageClassification.from_pretrained(
        local_model_path, local_files_only=True
    )
    model.to(device)
    model.eval()

    # Загружаем id2label из локального config.json
    config_path = os.path.join(local_model_path, "config.json")
    with open(config_path, "r") as f:
        config = json.load(f)
    id2label = config.get("id2label", {})
    if id2label and all(isinstance(k, int) for k in id2label.keys()):
        id2label = {str(k): v for k, v in id2label.items()}

    logger.info(f"Loaded {len(id2label)} class labels")


async def get_predict(
    file: UploadFile, predictions_count: int = PREDICTIONS_COUNT
) -> PredictResponse:
    """Используя модель для распознания, получаем предсказания по виду."""
    global processor, model, device, id2label

    if processor is None or model is None or device is None or id2label is None:
        logger.info("Loading model from 'get_predict' (api/identifier/model.py).")
        await load_model()

    if not file.content_type.startswith("image/"):  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image"
        )

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        if image.mode != "RGB":
            image = image.convert("RGB")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid image file: {e}"
        )

    inputs = processor(images=image, return_tensors="pt")  # type: ignore
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)  # type: ignore
        probabilities = torch.softmax(outputs.logits, dim=1)[0]

    top_probs, top_indices = torch.topk(probabilities, k=predictions_count)

    predictions = []
    for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
        label = id2label.get(str(idx), f"class_{idx}")  # type: ignore
        predictions.append(
            PlantPredict(
                lat_name=label,
                ru_name=translate_plant_name(label, idx),
                probability=round(prob, FLOAT_LEN_AFTER_DOT),
                class_id=idx,
            )
        )

    return PredictResponse(predictions=predictions)
