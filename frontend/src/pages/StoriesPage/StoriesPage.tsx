import { useState } from "react";
import { useStories } from "../../hooks";

import { Spinner } from "../../components/common";
import Button from "../../components/common/Button";

import StoryCard from "../../components/StoryCard";
import styles from "./StoriesPage.module.css";

function StoriesPage() {
  const [page, setPage] = useState(1);
  const { stories, hasMore, isLoading } = useStories({
    status: "approved",
    page,
  });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.storiesPage}>
      <h1 className={styles.pageTitle}>Истории</h1>
      <div className={styles.stories}>
        {stories.map((story) => {
          return (
            <StoryCard
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
