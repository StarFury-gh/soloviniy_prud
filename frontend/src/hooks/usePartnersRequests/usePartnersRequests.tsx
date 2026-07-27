import { useCallback, useEffect, useState } from "react";

import { API_URL, LS_ACCESS_TOKEN } from "../../constants";

import type { PartnerRequest } from "./types";

const PAGINATION_LIMIT = 4;

/**
 * Хук для получения списка заявок на партнерство с пагинацией и фильтрацией по статусу.
 *
 * @description
 * Хук загружает заявки на партнерство с сервера.
 * Требует авторизацию (токен берется из localStorage).
 * Поддерживает пагинацию (4 элемента на страницу) и фильтрацию по статусу заявки.
 * При изменении параметров (status, page) автоматически выполняет повторную загрузку.
 *
 * @param {Object} params - Параметры запроса
 * @param {string} [params.status="new"] - Статус заявок: "new" (новые), "rejected" (отклоненные), "approved" (одобренные)
 * @param {number} [params.page=1] - Номер страницы для пагинации (начинается с 1)
 *
 * @returns {Object} Объект с данными заявок и состоянием загрузки:
 * - `partnersRequests`: Array<PartnerRequest> — Массив заявок на текущей странице
 * - `isLoading`: boolean — true во время загрузки данных
 * - `hasMore`: boolean — true если есть ещё данные для загрузки следующей страницы
 * - `refetch`: () => void — Функция для принудительной перезагрузки данных
 *
 * @example
 * ```tsx
 * const { partnersRequests, isLoading, hasMore, refetch } = usePartnersRequests({
 *   status: "new",
 *   page: 1,
 * });
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {partnersRequests.map(request => (
 *       <PartnerRequestCard key={request.id} request={request} />
 *     ))}
 *     {hasMore && <button onClick={refetch}>Загрузить больше</button>}
 *   </div>
 * );
 * ```
 */
function usePartnersRequests({
  status = "new",
  page = 1,
}: {
  status?: string;
  page?: number;
}) {
  const [partnersRequests, setPartnersRequests] = useState<
    Array<PartnerRequest>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPartnersRequests = useCallback(async () => {
    setIsLoading(true);
    const offset = (page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams([
      ["limit", `${PAGINATION_LIMIT}`],
      ["offset", `${offset}`],
      ["status", status],
    ]);
    const url = `${API_URL}/partners/requests?${queryParams}`;
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
        setPartnersRequests(data.requests || []);
        setHasMore(data.requests.length >= PAGINATION_LIMIT);
      } else {
        console.error("Ошибка загрузки заявок:", response.statusText);
        setPartnersRequests([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setPartnersRequests([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    (() => {
      fetchPartnersRequests();
    })();
  }, [fetchPartnersRequests]);

  return {
    partnersRequests,
    isLoading,
    hasMore,
    refetch: fetchPartnersRequests,
  };
}

export default usePartnersRequests;
