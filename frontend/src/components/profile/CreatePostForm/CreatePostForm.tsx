import { useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./CreatePostForm.module.css";
import { Button, Input } from "../../common";

interface PhotoPreview {
  id: string;
  src: string;
}

const MAX_PHOTOS = 7;

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const filesToProcess = files.slice(0, MAX_PHOTOS - photos.length);

    let loadedCount = 0;
    const newPhotos: PhotoPreview[] = [];

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newPhotos.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            src: ev.target.result as string,
          });
        }
        loadedCount++;
        // Обновляем состояние после загрузки всех файлов
        if (loadedCount === filesToProcess.length) {
          setPhotos((prev) => [...prev, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) {
      alert("Пожалуйста, заполните название и текст истории");
      return;
    }

    setIsSubmitting(true);

    // Здесь можно отправить данные на сервер
    const formData = {
      title: title.trim(),
      text: text.trim(),
      photos: photos.map((p) => p.src),
    };

    console.log("Submitting story:", formData);

    // Имитация отправки
    setTimeout(() => {
      setIsSubmitting(false);
      setTitle("");
      setText("");
      setPhotos([]);
      alert("История успешно создана!");
    }, 1000);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.formCard}>
        <p className={styles.formTitle}>Создать историю</p>
        <p className={styles.formDesc}>
          Поделитесь историей с сообществом. Добавьте название, текст и
          фотографии.
        </p>

        <div className={styles.formRow}>
          <Input
            label="Название истории"
            required
            placeholder="Кратко опишите суть истории"
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className={styles.formRow}>
          <Input
            as="textarea"
            label="Текст истории"
            required
            placeholder="Расскажите подробнее..."
            value={text}
            onChange={(e) => (e.target as HTMLTextAreaElement).value}
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.photoLabel}>
            Фотографии истории
            <span className={styles.photoHint}>
              (необязательно, до {MAX_PHOTOS} фото, JPG/PNG)
            </span>
          </label>

          <div className={styles.photoUpload}>
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.photoUploadInput}
              onChange={handlePhoto}
              disabled={photos.length >= MAX_PHOTOS}
            />
            {photos.length === 0 ? (
              <>
                <span className={styles.photoUploadIcon}>СП</span>
                <span className={styles.photoUploadText}>
                  Нажмите для загрузки фото
                </span>
              </>
            ) : (
              <div className={styles.photoPreviewGrid}>
                {photos.map((photo) => (
                  <div key={photo.id} className={styles.photoItem}>
                    <img
                      src={photo.src}
                      alt="Предпросмотр"
                      className={styles.photoPreview}
                    />
                    <button
                      type="button"
                      className={styles.removePhotoBtn}
                      onClick={() => removePhoto(photo.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <span className={styles.addMoreHint}>
                    + добавить ещё ({MAX_PHOTOS - photos.length})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !text.trim()}
        >
          {isSubmitting ? "Отправка..." : "Опубликовать историю"}
        </Button>
      </div>
    </div>
  );
}

export default CreatePostForm;
