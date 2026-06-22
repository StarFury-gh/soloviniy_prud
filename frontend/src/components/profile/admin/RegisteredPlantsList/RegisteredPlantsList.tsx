import { useState, useEffect } from "react";

import RegisteredPlantCard from "../RegisteredPlantCard";

import { Button } from "../../../common";
import { AI_API_URL } from "../../../../constants";

import styles from "./RegisteredPlantsList.module.css";

interface RegisteredPlant {
  id: number;
  lat_name: string;
  ru_name: string;
}

const PAGINATION_LIMIT = 14;

function RegisteredPlantsList() {
  const [plants, setPlants] = useState<Array<RegisteredPlant>>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const getPlants = async () => {
      const params = new URLSearchParams();
      const offset = page * PAGINATION_LIMIT;
      params.append("limit", `${PAGINATION_LIMIT}`);
      params.append("offset", `${offset}`);
      const url = `${AI_API_URL}/plants/?${params}`;
      const response = await fetch(url);
      if (response.ok) {
        const data: Array<RegisteredPlant> = await response.json();
        console.log("data:", data);
        if (data.length < PAGINATION_LIMIT) {
          setHasMore(false);
        }
        setPlants((prevPlants) => [...prevPlants, ...data]);
      } else {
        console.error(`Unable to fetch: ${url}`);
        setHasMore(false);
      }
    };
    getPlants();
  }, [page]);

  const handlePlantRename = async (classId: number, newName: string) => {
    try {
      const url = `${AI_API_URL}/plants/update_translation`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ class_id: classId, new_ru_name: newName }),
      });

      if (!response.ok) {
        console.error(
          `Failed to update plant ${classId}:`,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error updating plant:", error);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {plants.map((plant) => (
          <RegisteredPlantCard
            key={plant.id}
            name={plant.ru_name}
            latinName={plant.lat_name}
            classId={plant.id}
            onRename={(newName) => handlePlantRename(plant.id, newName)}
            editable
          />
        ))}
      </div>
      {hasMore && (
        <Button
          style={{ maxWidth: 200, margin: "auto" }}
          onClick={handleLoadMore}
        >
          Загрузить ещё...
        </Button>
      )}
    </div>
  );
}

export default RegisteredPlantsList;
