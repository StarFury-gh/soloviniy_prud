import { useState } from "react";

import { Button } from "../../../common";

import { usePartnersRequests } from "../../../../hooks";

import { API_URL, LS_ACCESS_TOKEN } from "../../../../constants";

import PartnerRequestCard from "../PartnerRequestCard";
import styles from "./PartnersRequestsList.module.css";

type RequestStatus = "new" | "rejected" | "approved";

function PartnersRequestsList() {
  const [hiddenRequests, setHiddenRequests] = useState<Set<string>>(new Set());

  const [page, setPage] = useState<number>(1);
  const [findStatus, setFindStatus] = useState<RequestStatus>("new");

  const { partnersRequests, hasMore } = usePartnersRequests({
    status: findStatus,
    page,
  });

  const changeRequestStatus = async (
    partnerId: string,
    newStatus: RequestStatus,
  ) => {
    const url = `${API_URL}/partners/${partnerId}/status`;
    const token = localStorage.getItem("access_token");

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify({ new_status: newStatus }),
    });

    if (response.ok) {
      setHiddenRequests((prev) => new Set(prev).add(partnerId));
    } else {
      console.error("Error updating partner request status");
    }
  };

  const handleRequestStatusChange = (status: RequestStatus) => {
    setHiddenRequests(new Set());
    // setPage(1);
    setFindStatus(status);
  };

  const handleRequestDelete = async (id: string) => {
    const url = `${API_URL}/partners/${id}`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
      },
    });

    if (response.ok) {
      console.log("Deleted successfully");
      setHiddenRequests((prev) => new Set(prev).add(id));
    } else {
      console.error("Deleting partner error:", response.statusText);
    }
  };

  const visibleRequests = partnersRequests.filter(
    (request) => !hiddenRequests.has(request.id),
  );

  const statusLabels: Record<RequestStatus, string> = {
    new: "Новые",
    rejected: "Отклонённые",
    approved: "Принятые",
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Заявки на партнерство</h2>
        <p className={styles.pageDescription}>
          Просмотрите и одобрите заявки на партнерство
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
          <div className={styles.partners}>
            {visibleRequests.map((req) => {
              return (
                <PartnerRequestCard
                  key={req.id}
                  request={req}
                  onAccept={(id) => {
                    changeRequestStatus(id, "approved");
                  }}
                  onReject={(id) => {
                    changeRequestStatus(id, "rejected");
                  }}
                  onDelete={handleRequestDelete}
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

export default PartnersRequestsList;
