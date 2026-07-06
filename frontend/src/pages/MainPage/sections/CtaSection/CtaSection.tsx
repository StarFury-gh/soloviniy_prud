import { Button } from "../../../../components/common";
import styles from "./CtaSection.module.css";

interface CtaSectionProps {
  onNavigate: (page: string) => void;
}

function CtaSection({ onNavigate }: CtaSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.subtitle}>Вместе меняем город к лучшему</p>
        <h2 className={styles.title}>
          Станьте частью сообщества Соловьиного пруда
        </h2>
        <p className={styles.description}>
          Жители уже помогают сохранять это место. Присоединяйтесь — записывайте
          часы, голосуйте за проекты и сообщайте о проблемах.
        </p>
        <div className={styles.buttonContainer}>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              onNavigate("register");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Зарегистрироваться
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
