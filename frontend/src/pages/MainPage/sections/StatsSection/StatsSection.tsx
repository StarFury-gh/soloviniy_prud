import styles from "./StatsSection.module.css";

const stats = [
  { value: "0.79 га", label: "площадь прудового ландшафта" },
  { value: "XVIII", label: "век основания водоёма" },
  { value: "1 247", label: "зарегистрированных волонтёров" },
  { value: "4 сезона", label: "активности круглый год" },
];

function StatsSection() {
  return (
    <div className={styles.section}>
      <div className={styles.inner}>
        {stats.map(({ value, label }) => (
          <div key={value} className={styles.stat}>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsSection;
