import { Button } from "../../../../components/common";
import styles from "./CtaSection.module.css";

interface CtaSectionProps {
  onNavigate: (page: string) => void;
}

function CtaSection({ onNavigate }: CtaSectionProps) {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, var(--pond-600) 0%, var(--pond-500) 100%)",
        padding: "5rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--pond-200)",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Вместе меняем город к лучшему
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "white",
            margin: "0 0 1rem",
            lineHeight: 1.2,
          }}
        >
          Станьте частью сообщества Соловьиного пруда
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.0625rem",
            color: "var(--pond-100)",
            lineHeight: 1.7,
            margin: "0 0 2rem",
          }}
        >
          1 247 жителей уже помогают сохранять это место. Присоединяйтесь —
          записывайте часы, голосуйте за проекты и сообщайте о проблемах.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              onNavigate("volunteer");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              backgroundColor: "white",
              color: "var(--primary)",
              borderColor: "white",
            }}
          >
            🌿 Зарегистрироваться
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              onNavigate("development");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }}
          >
            📋 Смотреть план
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
