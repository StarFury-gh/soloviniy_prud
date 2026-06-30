import { useState, useEffect } from "react";
import { Button, Input } from "../../../common";
import { API_URL, LS_ACCESS_TOKEN } from "../../../../constants";
import styles from "./CreateStoryTagForm.module.css";
import { useStoryTags } from "../../../../hooks";
import type { Tag } from "../../../../hooks/useStoryTags/types";

function CreateStoryTagForm() {
  const [tagName, setTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  const availableTags = useStoryTags();

  // Синхронизация локального списка с серверным
  useEffect(() => {
    const updateTags = () => {
      setLocalTags(availableTags);
    };
    updateTags();
  }, [availableTags]);

  const handleCreateTag = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const trimmedTagName = tagName.trim();

    if (!trimmedTagName) {
      setError("Введите название тега");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const url = `${API_URL}/stories/new_tag`;
      const token = localStorage.getItem(LS_ACCESS_TOKEN);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({ name: trimmedTagName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Ошибка при создании тега");
        return;
      }

      setTagName("");
      setSuccess(true);

      // Добавляем тег в локальный список сразу после успешного создания
      const newTag: Tag = {
        tagId: Date.now(),
        tagName: trimmedTagName,
      };
      setLocalTags((prev) => [...prev, newTag]);

      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Ошибка соединения с сервером");
      console.error("CreateStoryTagForm error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <form className={styles.formCard} onSubmit={handleCreateTag}>
          <p className={styles.formTitle}>Создать тег</p>
          <p className={styles.formDesc}>Добавьте новый тег для историй</p>

          {success && (
            <div className={styles.successMessage}>Тег успешно создан!</div>
          )}

          <div className={styles.formRow}>
            <Input
              label="Название тега"
              required
              placeholder="Введите название тега"
              value={tagName}
              onChange={(e) => {
                setTagName(e.target.value);
                setError("");
              }}
              error={error}
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={isSubmitting || !tagName.trim()}
          >
            {isSubmitting ? "Создание..." : "Создать тег"}
          </Button>
        </form>

        <div className={styles.tagsListSection}>
          <p className={styles.tagsListTitle}>Доступные теги</p>
          <div className={styles.tagsContainer}>
            {localTags.length > 0 ? (
              localTags.map((tag) => (
                <span key={tag.tagId} className={styles.tagBadge}>
                  {tag.tagName}
                </span>
              ))
            ) : (
              <p className={styles.noTags}>Нет доступных тегов</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStoryTagForm;
