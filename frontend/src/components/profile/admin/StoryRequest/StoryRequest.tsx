import { useState } from "react";
import { STATIC_API_URL } from "../../../../constants";
import Button from "../../../common/Button/Button";
import styles from "./StoryRequest.module.css";

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
}: StoryRequestProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const truncatedContent =
    content && content.length > 100 ? content.slice(0, 100) + "..." : content;

  return (
    <div className={styles.storyRequest}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.author}>Автор: {author}</span>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      {images.length > 0 && (
        <div className={styles.imageSlider}>
          <div className={styles.imageContainer}>
            <img
              src={`${STATIC_API_URL}/${images[currentImageIndex]}`}
              alt={title}
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
        {content && (
          <>
            <p className={styles.description}>
              {showFullContent ? content : truncatedContent}
              {content.length > 100 && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className={styles.readMoreButton}
                >
                  {showFullContent ? "Скрыть" : "Читать далее"}
                </button>
              )}
            </p>
          </>
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
    </div>
  );
};

export default StoryRequest;
