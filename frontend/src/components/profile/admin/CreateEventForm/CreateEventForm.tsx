import { useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./CreateEventForm.module.css";
import { Button, Input } from "../../../common";

import { API_URL, LS_ACCESS_TOKEN } from "../../../../constants";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  banner?: string;
}

function CreateEventForm() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    banner: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          banner: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.date
    ) {
      alert("Пожалуйста, заполните все поля формы");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const url = `${API_URL}/events/new`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    const body = JSON.stringify({
      name: formData.title,
      description: formData.description,
      date: formData.date,
      banner: formData.banner,
    });

    const response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-type": "application/json",
        Authorization: token || "",
      },
    });

    setFormData({
      title: "",
      description: "",
      date: "",
      banner: undefined,
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      console.log("Событие успешно создано:", data);
      setStatusMessage({ type: "success", text: "Событие успешно добавлено!" });
      setTimeout(() => {
        setStatusMessage(null);
      }, 1500);
    } else {
      console.error("Ошибка при создании события");
      setStatusMessage({
        type: "error",
        text: "Ошибка при добавлении события. Попробуйте снова.",
      });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.formCard}>
          {statusMessage && (
            <div
              className={
                statusMessage.type === "success"
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {statusMessage.text}
            </div>
          )}
          <p className={styles.formTitle}>Создать событие</p>
          <p className={styles.formDesc}>
            Добавьте новое событие. Укажите название, описание и дату
            проведения.
          </p>

          <div className={styles.formRow}>
            <Input
              label="Название события"
              name="title"
              required
              placeholder="Кратко опишите событие"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <Input
              as="textarea"
              label="Описание события"
              name="description"
              required
              placeholder="Расскажите подробнее о событии..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.dateLabel}>Дата проведения</label>
            <input
              type="datetime-local"
              name="date"
              required
              className={styles.dateInput}
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.dateLabel}>Баннер события</label>
            <input
              type="file"
              accept="image/*"
              name="banner"
              className={styles.dateInput}
              onChange={handleBannerChange}
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.title.trim() ||
              !formData.description.trim() ||
              !formData.date
            }
          >
            {isSubmitting ? "Создание..." : "Создать событие"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateEventForm;
