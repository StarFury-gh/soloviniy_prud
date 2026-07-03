import { useCallback, useEffect, useState } from "react";

import { API_URL } from "../../constants";

import type { Story, UseStoriesProps } from "./types";

const PAGINATION_LIMIT = 4;

function useStories({ page = 1, tags = [] }: UseStoriesProps) {
  const [stories, setStories] = useState<Array<Story>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    const offset = (page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams([
      ["limit", `${PAGINATION_LIMIT}`],
      ["offset", `${offset}`],
    ]);

    if (tags.length > 0) {
      tags.forEach((tagId) => {
        queryParams.append("tags", `${tagId}`);
      });
    }

    const url = `${API_URL}/stories/?${queryParams}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json",
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
  }, [page, tags]);

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
