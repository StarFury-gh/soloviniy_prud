import { useCallback, useEffect, useState } from "react";

import { API_URL } from "../../constants";

import type { EventStatus, PrudEvent } from "./types";

const PAGINATION_LIMIT = 5;

/**
 * Хук для получения списка событий с пагинацией и фильтрацией по статусу.
 *
 * @description
 * Этот хук загружает события с сервера, поддерживает пагинацию (5 элементов на страницу)
 * и фильтрацию по статусу (прошедшие или будущие события).
 * При изменении параметров (status, page) автоматически выполняет повторную загрузку.
 *
 * @param {Object} params - Параметры запроса
 * @param {EventStatus} params.status - Статус событий: "past" (прошедшие) или "future" (будущие)
 * @param {number} params.page - Номер страницы для пагинации (начинается с 1)
 *
 * @returns {Object} Объект с данными событий и состоянием загрузки:
 * - `events`: Array<PrudEvent> — Массив событий на текущей странице
 * - `isLoading`: boolean — true во время загрузки данных
 * - `hasMore`: boolean — true если есть ещё данные для загрузки следующей страницы
 * - `refetch`: () => void — Функция для принудительной перезагрузки данных
 *
 * @example
 * ```tsx
 * const { events, isLoading, hasMore, refetch } = useEvents({
 *   status: "future",
 *   page: 1,
 * });
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {events.map(event => (
 *       <EventCard key={event.id} event={event} />
 *     ))}
 *     {hasMore && <button onClick={refetch}>Загрузить больше</button>}
 *   </div>
 * );
 * ```
 */
function useEvents({ status, page }: { status: EventStatus; page: number }) {
  const [events, setEvents] = useState<Array<PrudEvent>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const offset = (page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams([
      ["limit", `${PAGINATION_LIMIT}`],
      ["offset", `${offset}`],
      ["event_status", status],
    ]);
    const url = `${API_URL}/events/?${queryParams}`;

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
