import { useState, useEffect, useRef } from "react";

import RegisteredPlantCard from "../RegisteredPlantCard";

import { Button, Input } from "../../../common";
import { AI_API_URL, LS_ACCESS_TOKEN } from "../../../../constants";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const getPlants = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      const offset = page * PAGINATION_LIMIT;
      params.append("limit", `${PAGINATION_LIMIT}`);
      params.append("offset", `${offset}`);
      params.append("find", `${searchQuery}`);
      const url = `${AI_API_URL}/plants/?${params}`;
      const response = await fetch(url);
      if (response.ok) {
        const data: Array<RegisteredPlant> = await response.json();
        if (data.length < PAGINATION_LIMIT) {
          setHasMore(false);
        }
        setPlants((prevPlants) => [...prevPlants, ...data]);
      } else {
        console.error(`Unable to fetch: ${url}`);
        setHasMore(false);
      }
      setIsLoading(false);
    };
    getPlants();
  }, [page, searchQuery]);

  const handlePlantRename = async (classId: number, newName: string) => {
    try {
      const token = localStorage.getItem(LS_ACCESS_TOKEN);
      const url = `${AI_API_URL}/plants/update_translation`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setPage(0);
    setHasMore(true);
    setPlants([]);
    if (newQuery.length > 0 && !isSearching) {
      setIsSearching(true);
    }
  };

  const handleStopSearch = () => {
    setSearchQuery("");
    setPage(0);
    setHasMore(true);
    setIsSearching(false);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input
          type="text"
          placeholder="Поиск по имени..."
          value={searchQuery}
          className={styles.searchQuery}
          onChange={handleSearchChange}
        />
        {isSearching && (
          <Button className={styles.btn} onClick={handleStopSearch}>
            Прекратить поиск
          </Button>
        )}
      </div>
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
        <Button className={styles.btn} onClick={handleLoadMore}>
          Загрузить ещё...
        </Button>
      )}
      {isLoading && <div>Загрузка...</div>}
    </div>
  );
}

export default RegisteredPlantsList;
