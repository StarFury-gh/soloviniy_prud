import { useState, useRef } from "react";
import { Button, Input } from "../../common";
import styles from "./CreatePartnerRequest.module.css";

import { API_URL, LS_ACCESS_TOKEN } from "../../../constants";

type AllowedSocial = "VK" | "MAX" | "Other";

interface Social {
  social: AllowedSocial;
  url: string;
}

function CreatePartnerRequest() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [socials, setSocials] = useState<Social[]>([]);
  const [document, setDocument] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: File[] = [];
      for (let i = 0; i < files.length; i++) {
        newPhotos.push(files[i]);
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSocialChange = (
    index: number,
    field: keyof Social,
    value: string,
  ) => {
    setSocials((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSocial = () => {
    setSocials((prev) => [...prev, { social: "VK", url: "" }]);
  };

  const removeSocial = (index: number) => {
    setSocials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setDocument(files[0]);
    }
  };

  const removeDocument = () => {
    setDocument(null);
  };

  const clearEmptySocials = () => {
    const result = [];

    for (const social of socials) {
      if (!(social.url.trim() === "")) {
        result.push(social);
      }
    }

    return result;
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      setError("Заполните все обязательные поля");
      return;
    }

    if (socials.length > 0) {
      const hasIncompleteSocial = socials.some(
        (s) => !s.social?.trim() || !s.url?.trim(),
      );
      if (hasIncompleteSocial) {
        setError("Заполните все поля социальных сетей");
        return;
      }
    }

    setError("");
    setSuccess("");

    const bodyFormData = new FormData();

    const filteredSocials = clearEmptySocials();

    bodyFormData.append("name", name);
    bodyFormData.append("description", description);
    for (let i = 0; i < photos.length; i++) {
      bodyFormData.append("photos", photos[i]);
    }
    bodyFormData.append("socials", JSON.stringify(filteredSocials));
    if (document) {
      bodyFormData.append("document", document);
    }

    const url = `${API_URL}/partners/requests/new`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token || "",
      },
      body: bodyFormData,
    });

    if (response.ok) {
      setSuccess("Заявка успешно отправлена!");
      setTimeout(() => {
        setSuccess("");
        setName("");
        setDescription("");
        setPhotos([]);
        setSocials([{ social: "VK", url: "" }]);
        setDocument(null);
        if (documentInputRef.current) {
          documentInputRef.current.value = "";
        }
      }, 3000);
    } else {
      const msg = await response.text();
      console.error(`CreatePartnerRequest error: ${msg}`);
    }
  };

  const previewImages = photos.map((photo, index) => (
    <div key={index} className={styles.photoItem}>
      <img
        src={URL.createObjectURL(photo)}
        alt="Preview"
        className={styles.photoThumb}
      />
      <button
        type="button"
        onClick={() => handleRemovePhoto(index)}
        className={styles.removePhotoBtn}
      >
        ×
      </button>
    </div>
  ));

  const socialInputs = socials.map((social, index) => (
    <div key={index} className={styles.socialInput}>
      <select
        value={social.social}
        onChange={(e) => handleSocialChange(index, "social", e.target.value)}
        className={styles.socialSelect}
      >
        <option value="VK">VK</option>
        <option value="MAX">MAX</option>
        <option value="Other">Другое</option>
      </select>
      <Input
        type="text"
        placeholder="Ссылка на соцсеть"
        value={social.url}
        onChange={(e) => handleSocialChange(index, "url", e.target.value)}
      />
      {socials.length > 1 && (
        <button
          type="button"
          onClick={() => removeSocial(index)}
          className={styles.removeSocialButton}
        >
          Удалить
        </button>
      )}
    </div>
  ));

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Заявка на партнёрство</h2>
          <p className={styles.formDesc}>
            Заполните форму, чтобы стать партнёром проекта
          </p>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <Input
            type="text"
            label="Полное название организации"
            placeholder="Например: Эко-Технологии ООО"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            as="textarea"
            label="Описание организации"
            placeholder="Расскажите о вашей организации, её миссии и целях"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Фотографии</label>
            <p className={styles.hint}>Загрузите до 5 фотографий (jpg, png)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className={styles.fileInput}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Выбрать фотографии
            </Button>
            {photos.length > 0 && (
              <div className={styles.photosGrid}>{previewImages}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Документ (не обязательно)
            </label>
            <p className={styles.hint}>Загрузите документ (pdf, doc, docx)</p>
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleDocumentChange}
              className={styles.fileInput}
            />
            <Button
              variant="secondary"
              onClick={() => documentInputRef.current?.click()}
            >
              {document ? "Заменить документ" : "Выбрать документ"}
            </Button>
            {document && (
              <div className={styles.documentPreview}>
                <span>{document.name}</span>
                <button
                  type="button"
                  onClick={removeDocument}
                  className={styles.removeDocumentButton}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Социальные сети (не обязательно)
            </label>
            {socialInputs}
            <Button variant="text" onClick={addSocial}>
              + Добавить соцсеть
            </Button>
          </div>

          <Button variant="primary" fullWidth onClick={handleSubmit}>
            Отправить заявку
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreatePartnerRequest;
