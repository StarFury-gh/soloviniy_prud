import { useState, useRef } from "react";
import { Button } from "../common";
import styles from "./IdentifyPlantForm.module.css";

interface IdentifyPlantFormProps {
  onIdentify?: (image: File | null) => void;
  onRemoveImage?: () => void;
}

function IdentifyPlantForm({
  onIdentify,
  onRemoveImage,
}: IdentifyPlantFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const handleIdentify = () => {
    if (onIdentify && image) {
      onIdentify(image);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Распознавание растения</h2>

      <div
        className={`${styles.dropZone} ${previewUrl ? styles.hasImage : ""}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className={styles.imageContainer}>
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.previewImage}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className={styles.removeButton}
            >
              ×
            </button>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <span className={styles.dropText}>
              Перетащите изображение сюда или
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.browseButton}
            >
              Выбрать файл
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.cameraSection}>
        <p className={styles.cameraText}>Или сфотографируйте прямо сейчас:</p>
        <div className={styles.cameraButtons}>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className={styles.cameraInput}
          />
          <Button
            variant="secondary"
            onClick={() => cameraInputRef.current?.click()}
          >
            Сфотографировать
          </Button>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          onClick={handleIdentify}
          disabled={!image}
        >
          Распознать
        </Button>
      </div>
    </div>
  );
}

export default IdentifyPlantForm;
