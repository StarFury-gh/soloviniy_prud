import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./AdminEventCard.module.css";
import { Button, Input } from "../../../common";

export interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface AdminEventCardProps {
  event: EventData;
  onEdit: (updatedEvent: EventData) => void;
  onDelete: (eventId: number) => void;
}

function AdminEventCard({ event, onEdit, onDelete }: AdminEventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const [editedDescription, setEditedDescription] = useState(event.description);
  const [editedDate, setEditedDate] = useState(event.date);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setStatusMessage(null);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (
      !editedTitle.trim() ||
      !editedDescription.trim() ||
      !editedDate
    ) {
      setStatusMessage({
        type: "error",
        text: "Пожалуйста, заполните все поля",
      });
      return;
    }

    const updatedEvent: EventData = {
      id: event.id,
      title: editedTitle,
      description: editedDescription,
      date: editedDate,
    };

    onEdit(updatedEvent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!window.confirm("Вы уверены, что хотите удалить это событие?")) {
      return;
    }
    onDelete(event.id);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className={styles.card}>
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

      {isEditing ? (
        <form onSubmit={handleSave} className={styles.editForm}>
          <div className={styles.formRow}>
            <Input
              label="Название события"
              name="title"
              required
              value={editedTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditedTitle(e.target.value)
              }
            />
          </div>

          <div className={styles.formRow}>
            <Input
              as="textarea"
              label="Описание события"
              name="description"
              required
              value={editedDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setEditedDescription(e.target.value)
              }
            />
          </div>

          <div className={styles.formRow}>
            <Input
              label="Дата проведения"
              name="date"
              type="datetime-local"
              required
              value={editedDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditedDate(e.target.value)
              }
            />
          </div>

          <div className={styles.buttonRow}>
            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              Сохранить
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleEditToggle}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.header}>
            <h3 className={styles.title}>{event.title}</h3>
            <div className={styles.actions}>
              <Button
                variant="text"
                size="sm"
                onClick={handleEditToggle}
              >
                Редактировать
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
              >
                Удалить
              </Button>
            </div>
          </div>

          <div className={styles.content}>
            <p className={styles.description}>{event.description}</p>
            <div className={styles.dateContainer}>
              <span className={styles.dateLabel}>Дата:</span>
              <span className={styles.dateValue}>
                {formatDateTime(event.date)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminEventCard;
