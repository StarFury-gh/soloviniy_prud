import { useRef, useState } from "react";
import { STATIC_API_URL } from "../../../../constants";
import Button from "../../../common/Button/Button";
import styles from "./PartnerRequestCard.module.css";

import { clip_icon, delete_icon, check_icon } from "../../../../icons";

import { Link } from "react-router-dom";

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
  docs: Array<string>;
}

interface PartnerRequestCardProps {
  request: PartnerRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onSendDoc?: (doc: File | null, partnerId: string) => void;
}

function PartnerRequestCard({
  request,
  onAccept,
  onReject,
  onDelete,
  onSendDoc,
}: PartnerRequestCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { name, description, socials, photos, docs } = request;

  const handleClipButtonClick = () => {
    console.log("clicked");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setShowSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendDoc = () => {
    if (onSendDoc) {
      onSendDoc(file, request.id);
      setShowSuccess(true);
    }
  };

  const truncatedDescription =
    description && description.length > 150
      ? description.slice(0, 150) + "..."
      : description;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.name}>
          {name} <img src={check_icon} />
        </h2>
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
                    {social.social === "Other" ? "Другое" : social.social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {docs.length > 0 && (
          <div className={styles.docs}>
            <h4>Партнёр загрузил документы:</h4>
            <ul>
              {docs.map((doc, idx) => {
                return (
                  <li key={doc}>
                    <Link to={`/docs/${doc}`}>Документ {idx + 1}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className={styles.photos}>
          <div className={styles.photosGrid}>
            {photos.map((photo, index) => (
              <div key={index} className={styles.photoItem}>
                <img
                  src={`${STATIC_API_URL}/${photo}`}
                  alt={`Фото партнера ${index + 1}`}
                  className={styles.photo}
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
        <div className={styles.editContainer}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          {!file ? (
            <button
              onClick={() => handleClipButtonClick()}
              className={styles.addDocButton}
            >
              <img
                src={clip_icon}
                className={styles.clipIcon}
                alt="Добавить документ"
              />
              <span className={styles.addDocText}>Добавить документ</span>
            </button>
          ) : (
            <div className={styles.fileContainerWrapper}>
              <div className={styles.fileContainer}>
                <span className={styles.fileName}>{file.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className={styles.removeFileButton}
                >
                  <img
                    src={delete_icon}
                    className={styles.deleteIcon}
                    alt="Удалить"
                  />
                </button>
              </div>
              <button className={styles.sendButton} onClick={handleSendDoc}>
                Отправить
              </button>
            </div>
          )}
          {showSuccess && (
            <div className={styles.successMessage}>
              <img
                src="/check-circle.svg"
                alt="Успех"
                className={styles.successIcon}
              />
              <span className={styles.successText}>Файл успешно загружен</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PartnerRequestCard;
