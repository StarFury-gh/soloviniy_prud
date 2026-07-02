import { useState } from "react";
import { STATIC_API_URL } from "../../../../constants";
import Button from "../../../common/Button/Button";
import styles from "./StoryRequest.module.css";

import { edit_icon } from "../../../../icons";

interface StoryRequestProps {
  id: number;
  author: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  createdAt: string;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onStoryUpdate?: (id: number, title: string, content: string) => void;
}

const StoryRequest = ({
  id,
  author,
  title,
  content,
  images,
  tags,
  createdAt,
  onAccept,
  onReject,
  onStoryUpdate,
}: StoryRequestProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(title);
  const [displayContent, setDisplayContent] = useState(content);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleEditFormClick = () => {
    setIsEditingForm(true);
    setEditedTitle(title);
    setEditedContent(content);
  };

  const handleStoryUpdate = () => {
    if (onStoryUpdate) {
      onStoryUpdate(id, editedTitle, editedContent);
    }
    setDisplayTitle(editedTitle);
    setDisplayContent(editedContent);
    setIsEditingForm(false);
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const truncatedContent =
    displayContent && displayContent.length > 100
      ? displayContent.slice(0, 100) + "..."
      : displayContent;

  return (
    <div className={styles.storyRequest}>
      {isEditingForm ? (
        <div className={styles.editForm}>
          <div className={styles.formGroup}>
            <label>Заголовок:</label>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Контент:</label>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={styles.formTextarea}
            />
          </div>
          <div className={styles.formActions}>
            <Button onClick={handleStoryUpdate}>Изменить</Button>
            <Button variant="secondary" onClick={() => setIsEditingForm(false)}>
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.titleContainer}>
              <h3 className={styles.title}>{displayTitle}</h3>
            </div>
            <span className={styles.author}>Автор: {author}</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>

          {images.length > 0 && (
            <div className={styles.imageSlider}>
              <div className={styles.imageContainer}>
                <img
                  src={`${STATIC_API_URL}/${images[currentImageIndex]}`}
                  alt={displayTitle}
                  className={styles.sliderImage}
                />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className={styles.sliderButton}
                    disabled={currentImageIndex === 0}
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={handleNextImage}
                    className={styles.sliderButton}
                    disabled={currentImageIndex === images.length - 1}
                  >
                    {">"}
                  </button>
                </>
              )}
              {images.length > 1 && (
                <div className={styles.imageIndicators}>
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.indicator} ${
                        index === currentImageIndex ? styles.active : ""
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={styles.content}>
            {displayContent && (
              <div className={styles.contentContainer}>
                <p className={styles.description}>
                  {showFullContent ? displayContent : truncatedContent}
                  {displayContent.length > 100 && (
                    <button
                      onClick={() => setShowFullContent(!showFullContent)}
                      className={styles.readMoreButton}
                    >
                      {showFullContent ? "Скрыть" : "Читать далее"}
                    </button>
                  )}
                </p>
              </div>
            )}
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button onClick={handleEditFormClick} className={styles.editButton}>
              <img src={edit_icon} alt="" />
            </button>
            <Button
              variant="primary"
              onClick={() => onAccept(id)}
              className={styles.acceptButton}
            >
              Подтвердить
            </Button>
            <Button variant="danger" onClick={() => onReject(id)}>
              Отклонить
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StoryRequest;
