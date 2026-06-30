import { useState } from "react";
import { STATIC_API_URL } from "../../../../constants";
import Button from "../../../common/Button/Button";
import styles from "./PhotoRequest.module.css";

interface RequestAuthor {
  id: string;
  name: string;
  surname: string;
}

interface PhotoRequest {
  publishing_id: string;
  author: RequestAuthor;
  // Список путей до фотографий в STATIC_API_URL/{photos[i]}
  photos: Array<string>;
  created_at?: string;
}

interface PhotoRequestProps {
  request: PhotoRequest;
  onAccept: () => void;
  onReject: () => void;
}

function PhotoRequest(props: PhotoRequestProps) {
  const { request } = props;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { author, photos, created_at } = request;
  const authorName = `${author.name} ${author.surname}`;

  const handlePhotoClick = (photo: string) => {
    setSelectedPhoto(`${STATIC_API_URL}/${photo}`);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className={styles.photoRequest}>
      <div className={styles.header}>
        <span className={styles.author}>Автор: {authorName}</span>
        {formattedDate && (
          <span className={styles.date}>{formattedDate}</span>
        )}
      </div>

      <div className={styles.photosGallery}>
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <img
              key={`${request.publishing_id}-${index}`}
              src={`${STATIC_API_URL}/${photo}`}
              alt={`Photo ${index + 1}`}
              className={styles.photo}
              loading="lazy"
              onClick={() => handlePhotoClick(photo)}
            />
          ))
        ) : (
          <div className={styles.emptyGallery}>Нет фотографий</div>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={props.onAccept}
          className={styles.acceptButton}
        >
          Подтвердить
        </Button>
        <Button variant="danger" onClick={props.onReject}>
          Отклонить
        </Button>
      </div>

      {selectedPhoto && (
        <div className={styles.modal} onClick={handleBackdropClick}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              ×
            </button>
            <img
              src={selectedPhoto}
              alt="Full size"
              className={styles.modalImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoRequest;
