import { useState } from "react";
import { useStories } from "../../hooks";

import { Spinner } from "../../components/common";

import StoryCard from "../../components/StoryCard";
import styles from "./StoriesPage.module.css";

function StoriesPage() {
  const [page, setPage] = useState(1);
  const { stories, hasMore, isLoading } = useStories({
    status: "approved",
    page,
  });

  return (
    <div className={styles.storiesPage}>
      <h1 className={styles.pageTitle}>Истории</h1>
      <div className={styles.stories}>
        {stories.map((story) => {
          return (
            <StoryCard
              author="Имя Фамилия"
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
    </div>
  );
}

export default StoriesPage;
