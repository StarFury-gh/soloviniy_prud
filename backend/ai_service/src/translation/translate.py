import json
import logging
import sqlite3

from deep_translator import GoogleTranslator

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger("translate.py")

MOCK_NAME = "Alea iacta est."
SQLITE_FILE = "translations.db"

TRANSLATOR = GoogleTranslator(source="latin", target="ru")


class Plant:
    def __init__(self, class_id: int, lat_name: str, ru_name: str | None = None):
        self.lat_name = lat_name
        self.ru_name = ru_name
        self.class_id = class_id

    def __repr__(self):
        return f"<Plant class_id={self.class_id} lat_name={self.lat_name} ru_name={self.ru_name}>"


def _load_dict_plants_from_json() -> dict:
    """Возвращает все доступные названия растений из конфига модели в виде словаря (dict)"""
    with open("./models/identifier/config.json") as config_file:
        data = json.load(config_file)
        id2label_fields = data.get("id2label")
        return id2label_fields


def _get_plants_objects() -> list[Plant]:
    """Возвращает все растения из id2label в виде Python объекта"""
    dict_with_all = _load_dict_plants_from_json()
    result = []
    for class_idx, plant_name in dict_with_all.items():
        result.append(Plant(class_id=class_idx, lat_name=plant_name))

    return result


def _get_longest_lat_name(plants: list[Plant]) -> tuple:
    """Возвращает кортеж с самым длинным названием вида из id2label. result[0]: его длина, result[1] - само название"""
    max_len = len(plants[0].lat_name)
    name = plants[0].lat_name

    for plant in plants:
        new_len = len(plant.lat_name)
        if new_len > max_len:
            max_len = new_len
            name = plant.lat_name

    return max_len, name


def _get_translation_from_db(lat_name: str) -> str | None:
    """Возврвщает перевод слова из БД, если его нет, возвращает None"""
    connection = sqlite3.connect(SQLITE_FILE)
    cursor = connection.cursor()
    cursor.execute(
        "SELECT lat_name, ru_name, class_id FROM plants_translations WHERE lat_name=?",
        (lat_name,),
    )
    result = cursor.fetchone()

    logger.info(f"_get_translation_from_db {result=}")

    cursor.close()
    connection.close()
    if result is not None:
        return result[1]


def _save_translation_to_sqlite_db(
    lat_name: str, ru_name: str, class_id: int = 1
) -> None:
    """Сохраняем перевод латинского названия на русский в SQLITE"""
    connection = sqlite3.connect(SQLITE_FILE)
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO plants_translations (lat_name, ru_name, class_id) VALUES (?, ?, ?)",
        (
            lat_name,
            ru_name,
            class_id,
        ),
    )
    logger.info(f"Saved translation for: {lat_name} as {ru_name} class_id: {class_id}")

    connection.commit()

    cursor.close()
    connection.close()


def init_sqlite_plants_translations_db():
    """Инициализация sqlite3 таблицы для переводов"""
    connection = sqlite3.connect(SQLITE_FILE)
    cursor = connection.cursor()
    # cursor.execute("DROP TABLE plants_translations;")
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS plants_translations (id INTEGER PRIMARY KEY, lat_name VARCHAR(255), ru_name VARCHAR(255), class_id INTEGER);"
    )
    connection.commit()
    logger.info("TABLE plants_translations WAS INITIALIZED.")


def translate_plant_name(name: str, class_id: int) -> str:
    """Используя переводчик или БД, получаем перевод растения с латинского на русский"""
    # init_sqlite_plants_translations_db()
    # Смотрим локально в бд
    translation = _get_translation_from_db(name)
    if translation is None:
        # Переводим через переводчик
        translation = TRANSLATOR.translate(name)
        # Сохраняем в бд
        _save_translation_to_sqlite_db(name, translation, class_id=class_id)

    return translation
