import { useCallback, useEffect, useState } from "react";

import { API_URL } from "../../constants";

import type { EventStatus, PrudEvent } from "./types";

interface UseEventsParams {
  status: EventStatus;
  page: number;
}

const PAGINATION_LIMIT = 5;

function useEvents({ status, page }: UseEventsParams) {
  const [events, setEvents] = useState<Array<PrudEvent>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchEvents = useCallback(async () => {
    const offset = (page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams([
      ["limit", `${PAGINATION_LIMIT}`],
      ["offset", `${offset}`],
      ["event_status", status],
    ]);
    const url = `${API_URL}/events?${queryParams}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        setHasMore(data.events.length >= PAGINATION_LIMIT);
      } else {
        console.error("Ошибка загрузки событий:", response.statusText);
        setEvents([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setEvents([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    (() => {
      fetchEvents();
    })();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    hasMore,
    refetch: fetchEvents,
  };
}

export default useEvents;
