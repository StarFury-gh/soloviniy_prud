import { useState } from "react";
import { STATIC_API_URL } from "../../constants";
import Button from "../common/Button";
import styles from "./EventCard.module.css";

import event_splash from "/event_splash.png";

interface EventCardProps {
  id: number;
  name: string;
  description: string;
  date: string;
  banner?: string | null;
}

function EventCard(props: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxContentLength = 100;
  const shouldShowReadMore = props.description.length > maxContentLength;
  const displayedDescription = isExpanded
    ? props.description
    : props.description.slice(0, maxContentLength);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className={styles.eventCard}>
      <div className={styles.imageContainer}>
        <img
          src={
            props.banner ? `${STATIC_API_URL}/${props.banner}` : event_splash
          }
          alt={props.name}
          className={styles.banner}
        />
        <div className={styles.dateBadge}>{formatDate(props.date)}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{props.name}</h3>
        <p className={styles.description}>{displayedDescription}</p>
        {shouldShowReadMore && (
          <Button
            variant="text"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.readMoreButton}
          >
            {isExpanded ? "Свернуть" : "Читать далее"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
