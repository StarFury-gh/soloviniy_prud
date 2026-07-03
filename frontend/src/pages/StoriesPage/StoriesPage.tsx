import { useState } from "react";
import { useStories, useStoryTags } from "../../hooks";

import { Spinner } from "../../components/common";
import Button from "../../components/common/Button";

import StoryCard from "../../components/StoryCard";
import styles from "./StoriesPage.module.css";

function StoriesPage() {
  const [page, setPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<Array<number>>([]);
  const { stories, hasMore, isLoading } = useStories({
    page,
    tags: selectedTags,
  });
  const availableTags = useStoryTags();

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  return (
    <div className={styles.storiesPage}>
      <h1 className={styles.pageTitle}>Истории</h1>
      {availableTags.length > 0 && (
        <div className={styles.tagsSelector}>
          {availableTags.map((tag) => (
            <button
              key={tag.tagId}
              className={`${styles.tagButton} ${
                selectedTags.includes(tag.tagId) ? styles.tagButtonActive : ""
              }`}
              onClick={() => handleTagToggle(tag.tagId)}
            >
              {tag.tagName}
            </button>
          ))}
        </div>
      )}
      <div className={styles.stories}>
        {stories.map((story) => {
          return (
            <StoryCard
              title={story.title}
              author={story.author}
              storyTags={story.tags}
              content={story.content}
              publishedAt={story.created_at}
              images={story.images}
            />
          );
        })}
      </div>
      {isLoading && (
        <div className={styles.loadingMore}>
          <Spinner />
        </div>
      )}
      {hasMore && !isLoading && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={handleLoadMore} variant="primary" size="md">
            Загрузить ещё
          </Button>
        </div>
      )}
    </div>
  );
}

export default StoriesPage;
