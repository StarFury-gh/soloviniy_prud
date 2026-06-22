import { useState } from "react";

import { Button } from "../../../common";

import { useStories } from "../../../../hooks";

import { API_URL, LS_ACCESS_TOKEN } from "../../../../constants";
import StoryRequest from "../StoryRequest";
import styles from "./StoriesRequestsList.module.css";

type RequestStatus = "new" | "rejected" | "approved";

function StoriesRequestsList() {
  const [hiddenRequests, setHiddenRequests] = useState<Set<number>>(new Set());

  const [page, setPage] = useState<number>(1);
  const [findStatus, setFindStatus] = useState<RequestStatus>("new");

  const { stories, hasMore } = useStories({
    status: findStatus,
    page,
  });

  const changeRequestStatus = async (
    storyId: number,
    newStatus: RequestStatus,
  ) => {
    const queryParams = new URLSearchParams([
      ["story_id", `${storyId}`],
      ["new_status", `${newStatus}`],
    ]);
    const url = `${API_URL}/stories/status?${queryParams}`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: token || "",
      },
    });

    if (response.ok) {
      setHiddenRequests((prev) => new Set(prev).add(storyId));
    } else {
      console.error("Error");
    }
  };

  const handleRequestStatusChange = (status: RequestStatus) => {
    setHiddenRequests(new Set());
    setPage(1);
    setFindStatus(status);
  };

  const visibleRequests = stories.filter(
    (story) => !hiddenRequests.has(story.id),
  );

  const statusLabels: Record<RequestStatus, string> = {
    new: "Новые",
    rejected: "Отклонённые",
    approved: "Принятые",
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Заявки на истории</h2>
        <p className={styles.pageDescription}>
          Просмотрите и одобрите заявки на публикацию историй
        </p>
      </div>

      <div className={styles.filters}>
        {(Object.keys(statusLabels) as RequestStatus[]).map((status) => (
          <Button
            key={status}
            variant={findStatus === status ? "primary" : "secondary"}
            onClick={() => handleRequestStatusChange(status)}
          >
            {statusLabels[status]}
          </Button>
        ))}
      </div>

      {visibleRequests.length === 0 ? (
        <div className={styles.noRequests}>
          <p className={styles.noRequestsText}>Заявок пока нет</p>
        </div>
      ) : (
        <>
          <div className={styles.stories}>
            {visibleRequests.map((req) => {
              return (
                <StoryRequest
                  key={req.id}
                  id={req.id}
                  author={req.author_id}
                  title={req.title}
                  content={req.content}
                  images={req.images}
                  tags={req.tags}
                  createdAt={req.created_at}
                  onAccept={(id) => {
                    changeRequestStatus(id, "approved");
                  }}
                  onReject={(id) => {
                    changeRequestStatus(id, "rejected");
                  }}
                />
              );
            })}
          </div>

          <div className={styles.pagination}>
            <Button
              className={styles.paginationButton}
              disabled={!(page > 1)}
              onClick={() => {
                setPage(page - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Назад
            </Button>
            <span className={styles.paginationInfo}>Страница {page}</span>
            <Button
              className={styles.paginationButton}
              disabled={!hasMore}
              onClick={() => {
                setPage(page + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Далее
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default StoriesRequestsList;
