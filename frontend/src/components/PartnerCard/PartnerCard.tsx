import { useState, useRef } from "react";
import { STATIC_API_URL } from "../../constants";
import styles from "./PartnerCard.module.css";

import { clip_icon, delete_icon, check_icon } from "../../icons";
import { Link } from "react-router-dom";

interface Socials {
  social: string;
  url: string;
}

interface PartnerCardProps {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
  socials: Array<Socials>;
  docs: Array<string>;
  trusted?: boolean;
  editable?: boolean;
  onSendDoc?: (doc: File | null, partnerId: string) => void;
}

function PartnerCard(props: PartnerCardProps) {
  const { name, description, photos, socials, editable, docs } = props;
  const [file, setFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!editable && props.onSendDoc) {
      alert("Действие недоступно");
      return;
    } else if (props.onSendDoc) {
      props.onSendDoc(file, props.id);
      setShowSuccess(true);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.name}>
          {name} {props.trusted ? <img src={check_icon} /> : null}
        </h2>
        <p className={styles.description}>{description}</p>

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
      {editable ? (
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
      ) : null}
    </div>
  );
}

export default PartnerCard;
