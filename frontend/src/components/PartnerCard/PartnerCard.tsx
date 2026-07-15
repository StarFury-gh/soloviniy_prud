import { STATIC_API_URL } from "../../constants";
import styles from "./PartnerCard.module.css";

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
}

function PartnerCard(props: PartnerCardProps) {
  const { name, description, photos, socials } = props;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
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
    </div>
  );
}

export default PartnerCard;
