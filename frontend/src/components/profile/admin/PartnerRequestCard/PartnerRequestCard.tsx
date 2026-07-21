import { useState } from "react";
import { STATIC_API_URL } from "../../../../constants";
import Button from "../../../common/Button/Button";
import styles from "./PartnerRequestCard.module.css";

import { clip_icon, delete_icon } from "../../../../icons";

interface Socials {
  social: string;
  url: string;
}

interface PartnerRequest {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
  socials: Array<Socials>;
  created_at: string;
}

interface PartnerRequestCardProps {
  request: PartnerRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

function PartnerRequestCard({
  request,
  onAccept,
  onReject,
  onDelete,
}: PartnerRequestCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { name, description, socials, photos, created_at } = request;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const formattedDate = new Date(created_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const truncatedDescription =
    description && description.length > 150
      ? description.slice(0, 150) + "..."
      : description;

  return (
    <div className={styles.partnerRequest}>
      <div className={styles.header}>
        <h3 className={styles.title}>{name}</h3>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      {photos.length > 0 && (
        <div className={styles.imageSlider}>
          <div className={styles.imageContainer}>
            <img
              src={`${STATIC_API_URL}/${photos[currentImageIndex]}`}
              alt={name}
              className={styles.sliderImage}
            />
          </div>
          {photos.length > 1 && (
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
                disabled={currentImageIndex === photos.length - 1}
              >
                {">"}
              </button>
            </>
          )}
          {photos.length > 1 && (
            <div className={styles.imageIndicators}>
              {photos.map((_, index) => (
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
        <div className={styles.descriptionContainer}>
          <p className={styles.description}>
            {showFullDescription ? description : truncatedDescription}
            {description && description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className={styles.readMoreButton}
              >
                {showFullDescription ? "Скрыть" : "Читать далее"}
              </button>
            )}
          </p>
        </div>

        {socials.length > 0 && (
          <div className={styles.socials}>
            <h4 className={styles.socialsTitle}>Социальные сети:</h4>
            <ul className={styles.socialsList}>
              {socials.map((social, index) => (
                <li key={index} className={styles.socialItem}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    {social.social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={() => onAccept(request.id)}
          className={styles.acceptButton}
        >
          Подтвердить
        </Button>
        <Button variant="danger" onClick={() => onReject(request.id)}>
          Отклонить
        </Button>
        <button
          onClick={() => onDelete(request.id)}
          className={styles.deleteButton}
        >
          <img src={delete_icon} alt="Удалить" className={styles.deleteIcon} />
        </button>
        <button className={styles.addDocButton}>
          <img
            src={clip_icon}
            className={styles.clipIcon}
            alt="Добавить док-т"
          />
        </button>
      </div>
    </div>
  );
}

export default PartnerRequestCard;
