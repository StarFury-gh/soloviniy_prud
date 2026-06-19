import { useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./CreatePostForm.module.css";
import { Button, Input } from "../../common";

import { useStoryTags } from "../../../hooks";
import { API_URL, LS_ACCESS_TOKEN } from "../../../constants";

const MAX_TAGS = 5;

interface PhotoPreview {
  id: string;
  src: string;
}

const MAX_PHOTOS = 7;

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [tags, setTags] = useState<number[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = useStoryTags();

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

  const addTag = () => {
    const tagId = Number(selectedTag);
    if (isNaN(tagId) || tags.includes(tagId) || tags.length >= MAX_TAGS) {
      return;
    }
    setTags((prev) => [...prev, tagId]);
    setSelectedTag("");
  };

  const removeTag = (tagId: number) => {
    setTags((prev) => prev.filter((id) => id !== tagId));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      alert("Пожалуйста, заполните название и текст истории");
      return;
    }

    setIsSubmitting(true);

    // Конвертируем photos в массивы Base64
    const imageBases: string[] = [];
    for (const photo of photos) {
      const base64String = photo.src;
      if (base64String) {
        imageBases.push(base64String);
      }
    }

    const url = `${API_URL}/stories/new`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    const body = JSON.stringify({
      title,
      content: text,
      images: imageBases,
      tags,
    });

    const response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        Authorization: token || "",
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("CreatePost error.");
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setTitle("");
      setText("");
      setPhotos([]);
      setTags([]);
      setSelectedTag("");
    }, 1000);
  };

  return (
    <div className={styles.page}>
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

          <div className={styles.tagsRow}>
            <label className={styles.tagsLabel}>
              Теги истории
              <span className={styles.tagsHint}>
                (необязательно, максимум {MAX_TAGS} тегов)
              </span>
            </label>
            <div className={styles.tagsContainer}>
              <select
                className={styles.tagsSelect}
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">Выберите тему...</option>
                {availableTags?.map((tag) => (
                  <option key={tag.tagId} value={tag.tagId}>
                    {tag.tagName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.addTagBtn}
                onClick={addTag}
                disabled={!selectedTag || tags.length >= MAX_TAGS}
              >
                Добавить
              </button>
            </div>
            <div className={styles.tagsList}>
              {tags.map((tagId) => {
                const tag = availableTags?.find((t) => t.tagId === tagId);
                if (!tag) return null;
                return (
                  <span key={tagId} className={styles.tagBadge}>
                    {tag.tagName}
                    <button
                      type="button"
                      className={styles.removeTagBtn}
                      onClick={() => removeTag(tagId)}
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
              {tags.length >= MAX_TAGS && (
                <span className={styles.tagsLimitHint}>
                  Максимум {MAX_TAGS} тегов
                </span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <Input
              as="textarea"
              label="Текст истории"
              required
              placeholder="Расскажите подробнее..."
              value={text}
              onChange={(e) => setText(e.target.value)}
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
    </div>
  );
}

export default CreatePostForm;
