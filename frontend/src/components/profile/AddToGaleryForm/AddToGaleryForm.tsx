import type { ChangeEvent, DragEvent } from "react";
import { useState, useRef, useEffect } from "react";
import Button from "../../common/Button/Button";
import styles from "./AddToGaleryForm.module.css";

import { API_URL, LS_ACCESS_TOKEN } from "../../../constants";

interface FileWithPreview extends File {
  preview?: string;
}

function AddToGaleryForm() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const disabled = false;

  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const filesList = event.target.files;
    if (!filesList) return;

    const newFiles = Array.from(filesList);
    if (selectedFiles.length + newFiles.length > 10) {
      alert("Можно выбрать не более 10 файлов");
      return;
    }

    const filesWithPreview = newFiles.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...filesWithPreview]);
    setOriginalFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const filesList = event.dataTransfer.files;
    const newFiles = Array.from(filesList);

    if (selectedFiles.length + newFiles.length > 10) {
      alert("Можно выбрать не более 10 файлов");
      return;
    }

    const filesWithPreview = newFiles.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...filesWithPreview]);
    setOriginalFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const file = prev[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
    setOriginalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    if (selectedFiles.length === 0 || disabled) {
      return;
    }

    try {
      const base64Files = await Promise.all(
        originalFiles.map((file): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result;
              if (typeof result === "string") {
                resolve(result);
              } else {
                reject(new Error("Failed to read file"));
              }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
        }),
      );

      const url = `${API_URL}/galery/add`;
      const token = localStorage.getItem(LS_ACCESS_TOKEN) || "";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ photos: base64Files }),
      });

      if (response.ok) {
        setSelectedFiles([]);
        setOriginalFiles([]);
      } else {
        console.error("Failed to upload images:", response.statusText);
        alert("Не удалось загрузить изображения. Попробуйте снова.");
      }
    } catch (error) {
      console.error("Error converting files to base64:", error);
      alert("Ошибка при обработке изображений. Проверьте выбранные файлы.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Добавить в галерею</h2>

        <div
          className={`${styles.fileInputContainer} ${isDragging ? styles.dragging : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            max={10}
            onChange={handleFileChange}
            disabled={disabled}
            className={styles.fileInput}
            ref={fileInputRef}
          />
          <div className={styles.fileInputContent}>
            <p className={styles.fileInputText}>
              Перетащите файлы сюда или{" "}
              <span
                className={styles.browseLink}
                onClick={() => fileInputRef.current?.click()}
              >
                выберите файлы
              </span>
            </p>
            <p className={styles.fileInputHint}>
              Максимум 10 файлов, поддерживаемые форматы: JPG, PNG, GIF
            </p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className={styles.previews}>
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={styles.previewContainer}
              >
                <img
                  src={file.preview || ""}
                  alt={`Preview of ${file.name}`}
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className={styles.removePreviewButton}
                  disabled={disabled}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <Button type="submit" disabled={disabled || selectedFiles.length === 0}>
          Отправить
        </Button>
      </form>
    </div>
  );
}

export default AddToGaleryForm;
