import { useState } from "react";
import { useEvents } from "../../hooks";

import { Spinner } from "../../components/common";
import Button from "../../components/common/Button";

import EventCard from "../../components/EventCard";
import styles from "./EventsPage.module.css";

type EventStatus = "past" | "future";

function EventsPage() {
  const [page, setPage] = useState<number>(1);
  const [searchStatus, setSearchStatus] = useState<EventStatus>("future");
  const { events, hasMore, isLoading } = useEvents({
    status: searchStatus,
    page,
  });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleStatusChange = (status: EventStatus) => {
    setSearchStatus(status);
    setPage(1);
  };

  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>События у пруда</h1>
      <div className={styles.statusFilters}>
        <Button
          variant={searchStatus === "future" ? "primary" : "outline"}
          onClick={() => handleStatusChange("future")}
        >
          Будущие
        </Button>
        <Button
          variant={searchStatus === "past" ? "primary" : "outline"}
          onClick={() => handleStatusChange("past")}
        >
          Прошедшие
        </Button>
      </div>
      <div className={styles.events}>
        {events.map((event) => {
          return (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              description={event.description}
              date={event.date}
              banner={event.path}
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

export default EventsPage;
