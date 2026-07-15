import { useState, useRef } from "react";
import { Button, Input } from "../../common";
import styles from "./CreatePartnerRequest.module.css";

import { API_URL, LS_ACCESS_TOKEN } from "../../../constants";

type AllowedSocial = "VK" | "MAX" | "Other";

interface Social {
  social: AllowedSocial;
  url: string;
}

interface CreatePartnerRequestBody {
  name: string;
  description: string;
  photos: string[];
  socials: Social[];
}

function CreatePartnerRequest() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [socials, setSocials] = useState<Social[]>([{ social: "VK", url: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            setPhotos((prev) => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
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

  const handleSubmit = async () => {
    if (!name || !description) {
      setError("Заполните все обязательные поля");
      return;
    }
    setError("");
    setSuccess("");

    const requestBody: CreatePartnerRequestBody = {
      name,
      description,
      photos,
      socials,
    };

    const url = `${API_URL}/partners/requests/new`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token || "",
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      setSuccess("Заявка успешно отправлена!");
      setTimeout(() => {
        setSuccess("");
        setName("");
        setDescription("");
        setPhotos([]);
        setSocials([{ social: "VK", url: "" }]);
      }, 3000);
    } else {
      const msg = await response.text();
      console.error(`CreatePartnerRequest error: ${msg}`);
    }
  };

  const previewImages = photos.map((photo, index) => (
    <div key={index} className={styles.photoPreview}>
      <img src={photo} alt="Preview" className={styles.previewImage} />
      <button
        type="button"
        onClick={() => handleRemovePhoto(index)}
        className={styles.removePhotoButton}
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
    <div className={styles.container}>
      <h2 className={styles.title}>Заявка на партнёрство</h2>
      <p className={styles.subtitle}>
        Заполните форму, чтобы стать партнёром проекта
      </p>

      <div className={styles.form}>
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

        <div className={styles.photosSection}>
          <label className={styles.label}>Фотографии</label>
          <p className={styles.photosHint}>
            Загрузите до 5 фотографий (jpg, png)
          </p>
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
            <div className={styles.photosPreview}>{previewImages}</div>
          )}
        </div>

        <div className={styles.socialsSection}>
          <label className={styles.label}>Социальные сети</label>
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
  );
}

export default CreatePartnerRequest;
