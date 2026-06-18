import { useState } from "react";

import IdentifyPlantForm from "../../components/IdentifyPlantForm";
import PlantPrediction from "../../components/PlantPrediction";
import { Spinner } from "../../components/common";

import styles from "./IdentifyPage.module.css";

import { AI_API_URL } from "../../constants";

interface PlantPrediction {
  lat_name: string;
  ru_name: string;
  probability: number;
}

interface PredictionResponse {
  predictions: Array<PlantPrediction>;
}

function IdentifyPage() {
  const [predictions, setPredictions] = useState<Array<PlantPrediction>>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const handlePlantIdentify = async (file: File | null) => {
    if (!file) {
      alert("Файл не выбран.");
      return;
    }
    console.log("Запрашиваем сервер...");
    setIsLoading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const url = `${AI_API_URL}/plants/identify/`;
      const response = await fetch(url, {
        method: "POST",
        body,
      });
      const data: PredictionResponse = await response.json();
      setPredictions(data.predictions);
    } catch (e) {
      console.error(`Identifying plant error: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPredictions([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <IdentifyPlantForm
          onRemoveImage={handleRemoveImage}
          onIdentify={handlePlantIdentify}
        />
        <div className={styles["predictions-list"]}>
          {loading && <Spinner />}
          {predictions?.map((prediction, index) => (
            <PlantPrediction
              key={index}
              lat_name={prediction.lat_name}
              ru_name={prediction.ru_name}
              probability={prediction.probability}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default IdentifyPage;
