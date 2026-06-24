import { useState } from "react";
import { STATIC_API_URL } from "../../constants";
import styles from "./GaleryPublication.module.css";

interface PublicationAuthor {
  id: string;
  name: string;
  surname: string;
}

interface GaleryPublicationProps {
  publication_id: string;
  author: PublicationAuthor;
  photos: Array<string>;
}

function GaleryPublication(props: GaleryPublicationProps) {
  const { author, photos } = props;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  return (
    <>
      <div className={styles.galleryCard}>
        <div className={styles.header}>
          <span className={styles.author}>{authorName}</span>
        </div>
        <div className={styles.photosGallery}>
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <img
                key={`${props.publication_id}-${index}`}
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
    </>
  );
}

export default GaleryPublication;
