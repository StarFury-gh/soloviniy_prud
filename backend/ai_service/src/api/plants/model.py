from fastapi import UploadFile, HTTPException, status

from transformers import AutoImageProcessor, AutoModelForImageClassification
import os
import json
import torch
import io
import logging

from PIL import Image
from functools import lru_cache

from translation import translate_plant_name

from .schemas import PlantPredict, PredictResponse

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)


PREDICTIONS_COUNT = 3
FLOAT_LEN_AFTER_DOT = 4


@lru_cache(maxsize=1)
def load_model():
    """Загружает ML-модель один раз и кеширует её."""
    local_model_path = "./models/identifier"
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    logger.info(f"🔄 Loading model from {local_model_path}...")
    processor = AutoImageProcessor.from_pretrained(
        local_model_path, local_files_only=True
    )
    model = AutoModelForImageClassification.from_pretrained(
        local_model_path, local_files_only=True
    )
    model.to(device)
    model.eval()

    config_path = os.path.join(local_model_path, "config.json")
    with open(config_path, "r") as f:
        config = json.load(f)
    id2label = config.get("id2label", {})
    if id2label and all(isinstance(k, int) for k in id2label.keys()):
        id2label = {str(k): v for k, v in id2label.items()}

    logger.info(f"✅ Model loaded on {device} with {len(id2label)} classes")
    return processor, model, device, id2label


async def get_predict(
    file: UploadFile, predictions_count: int = PREDICTIONS_COUNT
) -> PredictResponse:
    processor, model, device, id2label = load_model()

    if not file.content_type.startswith("image/"):
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

    inputs = processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=1)[0]

    top_probs, top_indices = torch.topk(probabilities, k=predictions_count)

    predictions = []
    for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
        label = id2label.get(str(idx), f"class_{idx}")
        predictions.append(
            PlantPredict(
                lat_name=label,
                ru_name=translate_plant_name(label, idx),
                probability=round(prob, FLOAT_LEN_AFTER_DOT),
                class_id=idx,
            )
        )

    return PredictResponse(predictions=predictions)
