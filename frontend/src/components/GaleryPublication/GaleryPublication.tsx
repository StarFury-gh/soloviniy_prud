import { useState, useCallback } from "react";
import { STATIC_API_URL } from "../../constants";
import styles from "./GaleryPublication.module.css";

interface PublicationAuthor {
  id: string;
  name: string;
}

interface GaleryPublicationProps {
  publication_id: string;
  author: PublicationAuthor;
  photos: Array<string>;
  description?: string;
}

function GaleryPublication(props: GaleryPublicationProps) {
  const { author, photos, description, publication_id } = props;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handlePhotoClick = useCallback((photo: string) => {
    setSelectedPhoto(`${STATIC_API_URL}/${photo}`);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        handleCloseModal();
      }
    },
    [handleCloseModal],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    },
    [handleCloseModal],
  );

  return (
    <>
      <div className={styles.galleryCard}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              {author.name.charAt(0).toUpperCase()}
            </div>
            <span className={styles.author}>{author.name}</span>
          </div>
          <span className={styles.photoCount}>{photos.length} фото</span>
        </div>

        {description && <div className={styles.description}>{description}</div>}

        <div className={styles.photosGrid}>
          {photos.length > 0 ? (
            photos.map((photo, index) => {
              const isFirst = index === 0;
              const isLarge = index < 2 && photos.length > 3;

              return (
                <div
                  key={`${publication_id}-${index}`}
                  className={`${styles.photoWrapper} ${
                    isFirst && isLarge ? styles.photoFeatured : ""
                  } ${index % 5 === 4 ? styles.photoWide : ""}`}
                >
                  <img
                    src={`${STATIC_API_URL}/${photo}`}
                    alt={`Фото ${index + 1}`}
                    className={styles.photo}
                    loading="lazy"
                    onClick={() => {
                      console.log("photo");
                      handlePhotoClick(photo);
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className={styles.emptyGallery}>Нет фотографий</div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className={styles.modal}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={handleCloseModal}
              aria-label="Закрыть"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>
            <img
              src={selectedPhoto}
              alt="Полноразмерное фото"
              className={styles.modalImage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default GaleryPublication;
