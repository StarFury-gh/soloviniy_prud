import { useCallback, useEffect, useState } from "react";

import { API_URL, LS_ACCESS_TOKEN } from "../../constants";

import type { RequestInfo, RequestStatus } from "./types";

interface UseStoriesParams {
  status: RequestStatus;
  page: number;
}

const PAGINATION_LIMIT = 4;

function useStories({ status = "new", page = 1 }: UseStoriesParams) {
  const [stories, setStories] = useState<Array<RequestInfo>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchStories = useCallback(async () => {
    const offset = (page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams([
      ["limit", `${PAGINATION_LIMIT}`],
      ["offset", `${offset}`],
      ["status", status],
    ]);
    const url = `${API_URL}/stories/requests?${queryParams}`;
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
        setStories(data.stories || []);
        setHasMore(data.stories.length >= PAGINATION_LIMIT);
      } else {
        console.error("Ошибка загрузки заявок:", response.statusText);
        setStories([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setStories([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    // Простите...
    (() => {
      fetchStories();
    })();
  }, [fetchStories]);

  return {
    stories,
    isLoading,
    hasMore,
    refetch: fetchStories,
  };
}

export default useStories;
