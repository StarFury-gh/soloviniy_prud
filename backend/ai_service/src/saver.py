from transformers import AutoImageProcessor, AutoModelForImageClassification
import os

print("Начало загрузки")

model_id = "juppy44/plant-identification-2m-vit-b"
local_dir = "./models/identifier"

# Загружаем процессор и модель (в этот момент они будут скачаны и закэшированы)
processor = AutoImageProcessor.from_pretrained(model_id)
model = AutoModelForImageClassification.from_pretrained(model_id)

os.makedirs(local_dir, exist_ok=True)

# Сохраняем процессор и модель в локальную папку проекта
processor.save_pretrained(local_dir)
model.save_pretrained(local_dir)
print(f"Модель успешно сохранена в {local_dir}")
