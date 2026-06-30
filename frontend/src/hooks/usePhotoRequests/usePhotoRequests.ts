import { useCallback, useEffect, useState } from "react";

import { API_URL, LS_ACCESS_TOKEN } from "../../constants";

export interface PhotoRequestAuthor {
  id: string;
  name: string;
  surname: string;
}

export interface PhotoRequestInfo {
  publishing_id: string;
  author: PhotoRequestAuthor;
  photos: Array<string>;
  created_at: string;
}

export type PhotoRequestStatus = "new" | "rejected" | "approved";

const PAGINATION_LIMIT = 4;

/**
 * Хук для получения списка заявок на фотографии с пагинацией и фильтрацией по статусу.
 *
 * @description
 * Хук загружает заявки на публикацию фотографий с сервера.
 * Требует авторизацию (токен берется из localStorage).
 * Поддерживает пагинацию (4 элемента на страницу) и фильтрацию по статусу заявки.
 * При изменении параметров (status, page) автоматически выполняет повторную загрузку.
 *
 * @param {Object} params - Параметры запроса
 * @param {PhotoRequestStatus} [params.status="new"] - Статус заявок: "new" (новые), "rejected" (отклоненные), "approved" (одобренные)
 * @param {number} [params.page=1] - Номер страницы для пагинации (начинается с 1)
 *
 * @returns {Object} Объект с данными заявок и состоянием загрузки:
 * - `requests`: Array<PhotoRequestInfo> — Массив заявок на текущей странице
 * - `isLoading`: boolean — true во время загрузки данных
 * - `hasMore`: boolean — true если есть ещё данные для загрузки следующей страницы
 * - `refetch`: () => void — Функция для принудительной перезагрузки данных
 *
 * @example
 * ```tsx
 * const { requests, isLoading, hasMore, refetch } = usePhotoRequests({
 *   status: "new",
 *   page: 1,
 * });
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {requests.map(request => (
 *       <PhotoRequest key={request.publishing_id} request={request} />
 *     ))}
 *     {hasMore && <button onClick={refetch}>Загрузить больше</button>}
 *   </div>
 * );
 * ```
 */
function usePhotoRequests({
  status = "new",
  page = 1,
}: {
  status?: PhotoRequestStatus;
  page?: number;
}) {
  const [requests, setRequests] = useState<Array<PhotoRequestInfo>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    const offset = (page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams([
      ["limit", `${PAGINATION_LIMIT}`],
      ["offset", `${offset}`],
      ["status", status],
    ]);
    const url = `${API_URL}/galery/requests?${queryParams}`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json",
          Authorization: token || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRequests(data.requests || []);
        setHasMore(data.requests.length >= PAGINATION_LIMIT);
      } else {
        console.error("Ошибка загрузки заявок:", response.statusText);
        setRequests([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setRequests([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    (() => {
      fetchRequests();
    })();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    hasMore,
    refetch: fetchRequests,
  };
}

export default usePhotoRequests;
