import { useState } from "react";
import { API_URL, LS_ACCESS_TOKEN } from "../../../../constants";

import { Button } from "../../../common";

import { usePhotoRequests } from "../../../../hooks";
import PhotoRequest from "../PhotoRequest";
import styles from "./PhotoRequestsList.module.css";

type RequestStatus = "new" | "rejected" | "approved";

function PhotoRequestsList() {
  const [hiddenRequests, setHiddenRequests] = useState<Set<string>>(new Set());

  const [page, setPage] = useState<number>(1);
  const [findStatus, setFindStatus] = useState<RequestStatus>("new");

  const { requests, hasMore } = usePhotoRequests({
    status: findStatus,
    page,
  });

  const changeRequestStatus = async (
    publishingId: string,
    newStatus: RequestStatus,
  ) => {
    const queryParams = new URLSearchParams([
      ["publishing_id", publishingId],
      ["new_status", newStatus],
    ]);
    const url = `${API_URL}/galery/status?${queryParams}`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: token || "",
      },
    });

    if (response.ok) {
      setHiddenRequests((prev) => new Set(prev).add(publishingId));
    } else {
      console.error("Error");
    }
  };

  const handleRequestStatusChange = (status: RequestStatus) => {
    setHiddenRequests(new Set());
    setPage(1);
    setFindStatus(status);
  };

  const visibleRequests = requests.filter(
    (req) => !hiddenRequests.has(req.publishing_id),
  );

  const statusLabels: Record<RequestStatus, string> = {
    new: "Новые",
    rejected: "Отклонённые",
    approved: "Принятые",
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Заявки на фотографии</h2>
        <p className={styles.pageDescription}>
          Просмотрите и одобрите заявки на публикацию фотографий
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
          <div className={styles.requests}>
            {visibleRequests.map((req) => {
              return (
                <PhotoRequest
                  key={req.publishing_id}
                  request={req}
                  onAccept={() => {
                    changeRequestStatus(req.publishing_id, "approved");
                  }}
                  onReject={() => {
                    changeRequestStatus(req.publishing_id, "rejected");
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

export default PhotoRequestsList;
