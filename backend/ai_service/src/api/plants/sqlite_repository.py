import sqlite3
from typing import List

from logging import getLogger

from .abc_plants_repo import ABCPlantsRepository
from .schemas import Plant

logger = getLogger("SQLitePlantsRepository")


class SQLitePlantsRepository(ABCPlantsRepository):
    def __init__(self, db: str) -> None:
        self._db_path = db

    def get_registered_plants(self, limit: int, offset: int) -> List[Plant]:
        conn = sqlite3.connect(self._db_path)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT class_id, lat_name, ru_name FROM plants_translations LIMIT ? OFFSET ?",
            (
                limit,
                offset,
            ),
        )
        records = cursor.fetchall()

        records = [
            Plant(id=record[0], lat_name=record[1], ru_name=record[2])
            for record in records
        ]

        cursor.close()
        conn.close()

        return records

    def update_plant_translation(self, class_id: int, new_ru_name: str) -> Plant | None:
        logger.info(f"Rename: '{class_id}' ru_name -> '{new_ru_name}'")
        conn = sqlite3.connect(self._db_path)
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE plants_translations SET ru_name=? WHERE class_id=? RETURNING lat_name",
            (
                new_ru_name,
                class_id,
            ),
        )

        updated_lat_name = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        if updated_lat_name is None:
            return None

        return Plant(id=class_id, lat_name=updated_lat_name, ru_name=new_ru_name)
