import { useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./IssueReporter.module.css";
import { Button, Input } from "../../common";

const issueTypes = [
  { id: "bench", icon: "", label: "Сломанная лавочка" },
  { id: "trash", icon: "", label: "Свалка мусора" },
  { id: "tree", icon: "", label: "Больное дерево" },
  { id: "fence", icon: "", label: "Повреждённое ограждение" },
  { id: "light", icon: "", label: "Неисправное освещение" },
  { id: "other", icon: "", label: "Другое" },
];

interface Issue {
  id: number;
  type: string;
  icon: string;
  desc: string;
  date: string;
  status: "new" | "processing" | "fixed";
}

const mockIssues: Issue[] = [
  {
    id: 1,
    type: "Сломанная лавочка",
    icon: "",
    desc: "У северного берега сломана спинка",
    date: "14 апреля 2024",
    status: "fixed",
  },
  {
    id: 2,
    type: "Свалка мусора",
    icon: "",
    desc: "Незаконная свалка у восточного входа",
    date: "2 мая 2024",
    status: "processing",
  },
  {
    id: 3,
    type: "Больное дерево",
    icon: "",
    desc: "Дуб с трещиной в стволе, рядом с тропой",
    date: "18 мая 2024",
    status: "new",
  },
];

const statusLabel: Record<string, string> = {
  new: "Принято",
  processing: "Обрабатывается",
  fixed: "Устранено",
};

const statusClass: Record<string, string> = {
  new: styles.statusNew,
  processing: styles.statusProcessing,
  fixed: styles.statusFixed,
};

function IssueReporter() {
  const [tab, setTab] = useState<"report" | "myIssues">("report");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result)
          setPhotos((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (!selectedType || !desc.trim()) return;
    const typeObj = issueTypes.find((t) => t.id === selectedType);
    const newIssue: Issue = {
      id: Date.now(),
      type: typeObj?.label ?? selectedType,
      icon: typeObj?.icon ?? "",
      desc: desc.trim(),
      date: new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      status: "new",
    };
    setIssues((prev) => [newIssue, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedType(null);
      setDesc("");
      setPhotos([]);
      setTab("myIssues");
    }, 2500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.tabButtons}>
          <Button
            variant={tab === "report" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab("report")}
          >
            Сообщить о проблеме
          </Button>
          <Button
            variant={tab === "myIssues" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab("myIssues")}
          >
            Мои отчёты ({issues.length})
          </Button>
        </div>

        {tab === "report" && (
          <>
            {submitted ? (
              <div className={styles.successBanner}>
                <span className={styles.successBannerIcon}></span>
                <p className={styles.successBannerTitle}>Отчёт принят!</p>
                <p className={styles.successBannerDesc}>
                  Спасибо за внимательность. Ответственная бригада рассмотрит
                  обращение в течение 3 рабочих дней.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.formCard}>
                  <p className={styles.formTitle}>Новое обращение</p>
                  <p className={styles.formDesc}>
                    Выберите тип проблемы, опишите её и загрузите фото. Все
                    обращения рассматриваются в течение 3 дней.
                  </p>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Тип проблемы{" "}
                      <span className={styles.requiredMarker}>*</span>
                    </label>
                    <div className={styles.typeGrid}>
                      {issueTypes.map((t) => (
                        <button
                          key={t.id}
                          className={`${styles.typeBtn} ${
                            selectedType === t.id ? styles.selectedType : ""
                          }`}
                          onClick={() => setSelectedType(t.id)}
                          type="button"
                        >
                          <span className={styles.typeBtnIcon}>{t.icon}</span>
                          <span className={styles.typeBtnLabel}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <Input
                      as="textarea"
                      label="Описание проблемы"
                      required
                      placeholder="Опишите проблему подробнее: что произошло, где именно находится на берегу..."
                      value={desc}
                      onChange={(e) =>
                        setDesc((e.target as HTMLTextAreaElement).value)
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Фотография (необязательно)
                    </label>
                    <label
                      className={`${styles.photoUpload} ${
                        photos.length > 0 ? styles.hasPhoto : ""
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className={styles.photoUploadInput}
                        onChange={handlePhoto}
                      />
                      {photos.length === 0 ? (
                        <>
                          <span className={styles.photoUploadIcon}>СП</span>
                          <span className={styles.photoUploadText}>
                            Нажмите для загрузки фото
                          </span>
                          <span className={styles.photoUploadHint}>
                            JPG, PNG · до 10 МБ
                          </span>
                        </>
                      ) : (
                        <div className={styles.photoPreviewRow}>
                          {photos.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt={`Фото ${i + 1}`}
                              className={styles.photoPreview}
                            />
                          ))}
                          <span className={styles.photoUploadHint}>
                            + добавить ещё
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!selectedType || !desc.trim()}
                  >
                    Отправить обращение
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {tab === "myIssues" && (
          <div className={styles.issuesList}>
            {issues.length === 0 ? (
              <p className={styles.emptyIssuesText}>
                У вас ещё нет поданных обращений.
              </p>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className={styles.issueCard}>
                  <div className={styles.issueIconWrap}>{issue.icon}</div>
                  <div className={styles.issueInfo}>
                    <div className={styles.issueName}>{issue.type}</div>
                    <div className={styles.issueDesc}>{issue.desc}</div>
                    <div className={styles.issueDate}>{issue.date}</div>
                  </div>
                  <span
                    className={`${styles.issueBadge} ${statusClass[issue.status]}`}
                  >
                    {statusLabel[issue.status]}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueReporter;
