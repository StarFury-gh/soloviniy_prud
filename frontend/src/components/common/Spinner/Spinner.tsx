import styles from "./Spinner.module.css";

function Spinner() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <span>Загрузка...</span>
    </div>
  );
}

export default Spinner;
