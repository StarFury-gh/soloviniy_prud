from transformers import AutoImageProcessor, AutoModelForImageClassification
from huggingface_hub import login
import os

print("Начало загрузки")

token = os.environ.get("HF_TOKEN") or os.environ.get("HF_ACCESS_TOKEN")

if token:
    print("Аутентификация с Hugging Face...")
    login(token=token, add_to_git_credential=False)
else:
    print("ВНИМАНИЕ: Токен не найден! Модель может быть недоступна.")

model_id = "juppy44/plant-identification-2m-vit-b"
local_dir = "./models/identifier"

try:
    print(f"Загрузка модели {model_id}...")
    processor = AutoImageProcessor.from_pretrained(model_id, token=token)
    model = AutoModelForImageClassification.from_pretrained(model_id, token=token)
    print("Модель успешно загружена")

    # Создаём директорию и сохраняем
    os.makedirs(local_dir, exist_ok=True)
    processor.save_pretrained(local_dir)
    model.save_pretrained(local_dir)
    print(f"Модель успешно сохранена в {local_dir}")

except Exception as e:
    print(f"ОШИБКА при загрузке модели: {e}")
    raise
