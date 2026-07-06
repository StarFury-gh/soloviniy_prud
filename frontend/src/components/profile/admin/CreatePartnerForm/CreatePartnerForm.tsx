import { useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./CreatePartnerForm.module.css";
import { Button, Input } from "../../../common";

import { API_URL, LS_ACCESS_TOKEN } from "../../../../constants";

interface PartnerFormData {
  name: string;
  description: string;
  photos: string[];
}

function CreatePartnerForm() {
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    description: "",
    photos: [],
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

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        newPhotos.push(base64String);
        if (newPhotos.length === files.length) {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...newPhotos],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const url = `${API_URL}/partners/new`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    const body = JSON.stringify({
      name: formData.name,
      description: formData.description,
      photos: formData.photos,
    });

    const response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-type": "application/json",
        Authorization: token || "",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setFormData({
        name: "",
        description: "",
        photos: [],
      });
      setStatusMessage({ type: "success", text: "Партнер успешно добавлен!" });
      setTimeout(() => {
        setStatusMessage(null);
      }, 1500);
    } else {
      console.error("Ошибка при создании партнера");
      setStatusMessage({
        type: "error",
        text: "Ошибка при добавлении партнера. Попробуйте снова.",
      });
    }

    setIsSubmitting(false);
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
          <p className={styles.formTitle}>Создать партнера</p>
          <p className={styles.formDesc}>
            Добавьте нового партнера. Укажите название, описание и фотографии.
          </p>

          <div className={styles.formRow}>
            <Input
              label="Название партнера"
              name="name"
              required
              placeholder="Название организации или компании"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <Input
              as="textarea"
              label="Описание партнера"
              name="description"
              required
              placeholder="Расскажите о партнере..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.dateLabel}>Фотографии</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.dateInput}
              onChange={handlePhotoChange}
            />
            <p className={styles.hint}>
              Вы можете загрузить несколько фотографий
            </p>
          </div>

          {formData.photos.length > 0 && (
            <div className={styles.photosPreview}>
              <p className={styles.photosTitle}>Предпросмотр фотографий:</p>
              <div className={styles.photosGrid}>
                {formData.photos.map((photo, index) => (
                  <div key={index} className={styles.photoItem}>
                    <img
                      src={photo}
                      alt={`Предпросмотр ${index + 1}`}
                      className={styles.photoThumb}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className={styles.removePhotoBtn}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              !formData.description.trim()
            }
          >
            {isSubmitting ? "Создание..." : "Создать партнера"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreatePartnerForm;
