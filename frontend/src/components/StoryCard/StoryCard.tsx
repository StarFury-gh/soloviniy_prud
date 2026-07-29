import { useState } from "react";
import { STATIC_API_URL } from "../../constants";
import styles from "./StoryCard.module.css";

interface StoryAuthor {
  name: string;
}

interface StoryCardProps {
  author: StoryAuthor;
  storyTags: Array<string>;
  title: string;
  content: string;
  publishedAt: string;
  images: Array<string>;
}

function StoryCard(props: StoryCardProps) {
  const { author, storyTags, content, publishedAt, images, title } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const maxContentLength = 250;
  const shouldShowReadMore = content.length > maxContentLength;
  const displayedContent = isExpanded
    ? content
    : content.slice(0, maxContentLength);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className={styles.storyCard}>
      <div className={styles.header}>
        <span className={styles.author}>{author.name}</span>
        <span className={styles.date}>{formatDate(publishedAt)}</span>
      </div>

      {storyTags.length > 0 && (
        <div className={styles.tags}>
          {storyTags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {title && <h2 className={styles.title}>{title}</h2>}

      {images.length > 0 && (
        <div className={styles.slider}>
          <button
            className={styles.sliderButtonPrev}
            onClick={handlePrevSlide}
            disabled={images.length <= 1}
          >
            {/* <img src={left_arrow_icon} alt="<" /> */}
            {"<"}
          </button>
          <div className={styles.sliderInner}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.slide} ${
                  index === currentSlide ? styles.active : ""
                }`}
              >
                <img
                  src={`${STATIC_API_URL}/${image}`}
                  alt={`Slide ${index + 1}`}
                  className={styles.slideImage}
                />
              </div>
            ))}
          </div>
          <button
            className={styles.sliderButtonNext}
            onClick={handleNextSlide}
            disabled={images.length <= 1}
          >
            {/* <img src={right_arrow_icon} alt=">" /> */}
            {">"}
          </button>

          {images.length > 1 && (
            <div className={styles.sliderIndicators}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${
                    index === currentSlide ? styles.activeIndicator : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.content}>
        <p>{displayedContent}</p>
        {shouldShowReadMore && (
          <button
            className={styles.readMoreButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Свернуть" : "Показать ещё"}
          </button>
        )}
      </div>
    </div>
  );
}

export default StoryCard;
