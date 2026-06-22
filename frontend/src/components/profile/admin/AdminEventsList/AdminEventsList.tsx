import { useState } from "react";

import { Button } from "../../../common";

import { API_URL, LS_ACCESS_TOKEN } from "../../../../constants";
import { useEvents } from "../../../../hooks";

import AdminEventCard from "../AdminEventCard";
import styles from "./AdminEventsList.module.css";

type EventStatus = "past" | "future";

function AdminEventsList() {
  const [page, setPage] = useState<number>(1);
  const [eventStatus, setEventStatus] = useState<EventStatus>("future");

  const { events, hasMore, refetch } = useEvents({ status: eventStatus, page });

  const handleStatusChange = (status: EventStatus) => {
    setPage(1);
    setEventStatus(status);
  };

  const handleDeleteEvent = async (eventId: number) => {
    const url = `${API_URL}/events/delete/${eventId}/`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      });

      if (response.ok) {
        refetch();
      } else {
        console.error("Ошибка при удалении события:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  const handleEditEvent = async (updatedEvent: {
    id: number;
    title: string;
    description: string;
    date: string;
  }) => {
    const url = `${API_URL}/events/${updatedEvent.id}/`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    try {
      const body = JSON.stringify({
        new_name: updatedEvent.title,
        new_description: updatedEvent.description,
        new_date: updatedEvent.date,
      });

      const response = await fetch(url, {
        method: "PATCH",
        body,
        headers: {
          "Content-type": "application/json",
          Authorization: token || "",
        },
      });

      if (response.ok) {
        refetch();
      } else {
        console.error("Ошибка при обновлении события:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  const statusLabels: Record<EventStatus, string> = {
    future: "Будущие события",
    past: "Прошедшие события",
  };

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.name,
    description: event.description,
    date: event.date,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Управление событиями</h2>
        <p className={styles.pageDescription}>
          Просмотрите и отредактируйте события
        </p>
      </div>

      <div className={styles.filters}>
        {(Object.keys(statusLabels) as EventStatus[]).map((status) => (
          <Button
            key={status}
            variant={eventStatus === status ? "primary" : "secondary"}
            onClick={() => handleStatusChange(status)}
          >
            {statusLabels[status]}
          </Button>
        ))}
      </div>

      {formattedEvents.length === 0 ? (
        <div className={styles.noEvents}>
          <p className={styles.noEventsText}>Событий пока нет</p>
        </div>
      ) : (
        <>
          <div className={styles.eventsGrid}>
            {formattedEvents.map((event) => (
              <AdminEventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
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

export default AdminEventsList;
