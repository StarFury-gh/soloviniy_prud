import { Button } from "../../../../components/common";

import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  onNavigate: (arg: string) => void;
}

function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.eyebrow}>Владимир · Достопримечательность</div>
        <h1 className={styles.headline}>
          Соловьиный пруд —<br />
          <em>живое сердце</em> города
        </h1>
        <p className={styles.subtitle}>
          Уникальный природный и исторический ландшафт XVIII века в самом центре
          Владимира. Место, куда хочется возвращаться снова и снова — в любое
          время года.
        </p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate("login")}
          >
            Стать частью сообщества
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate("development")}
          >
            План развития
          </Button>
        </div>
      </div>

      <div className={styles.scroll}>
        <span>Прокрутите вниз</span>
        <span className={styles.scrollArrow}>↓</span>
      </div>
    </section>
  );
}

export default HeroSection;
