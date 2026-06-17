import styles from "./PlantPrediction.module.css";

interface PlantPredictionProps {
  lat_name: string;
  ru_name: string;
  probability: number;
}

function PlantPrediction(props: PlantPredictionProps) {
  const { lat_name, ru_name, probability } = props;

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - probability * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.probabilityCircle}>
        <svg viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
          <circle className={styles["circle-bg"]} cx="30" cy="30" r={radius} />
          <circle
            className={styles["circle-progress"]}
            cx="30"
            cy="30"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={styles.circlePercent}>
          {(probability * 100).toFixed(0)}%
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.ruName}>{ru_name}</h3>
        <p className={styles.latName}>{lat_name}</p>
        <p className={styles.probabilityText}>
          Уверенность: {(probability * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}

export default PlantPrediction;
