import { STATIC_API_URL } from "../../constants";
import styles from "./PartnerCard.module.css";

interface PartnerCardProps {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
}

function PartnerCard(props: PartnerCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.name}>{props.name}</h2>
        <p className={styles.description}>{props.description}</p>
      </div>

      {props.photos.length > 0 && (
        <div className={styles.photos}>
          <div className={styles.photosGrid}>
            {props.photos.map((photo, index) => (
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
