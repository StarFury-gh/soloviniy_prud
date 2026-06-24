import { useEffect, useState, useCallback } from "react";

import { API_URL } from "../../constants";

import type { GetPhotosServerResponse, GaleryPublication } from "./types";

interface useGaleryProps {
  page: number;
}

const PAGINATION_LIMIT = 3;

function useGalery({ page }: useGaleryProps) {
  const [publications, setPublications] = useState<Array<GaleryPublication>>(
    [],
  );
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPublications = useCallback(async () => {
    setIsLoading(true);
    const offset = (page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams({
      limit: `${PAGINATION_LIMIT}`,
      offset: `${offset}`,
    });
    const url = `${API_URL}/galery/?${queryParams}`;
    const response = await fetch(url);
    if (response.ok) {
      const data: GetPhotosServerResponse = await response.json();
      setPublications((prev) => [...prev, ...data.publications]);
      setHasMore(data.publications.length >= PAGINATION_LIMIT);
    }
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    const fetch = () => {
      fetchPublications();
    };
    fetch();
  }, [page, fetchPublications]);

  return { publications, hasMore, isLoading, refetch: fetchPublications };
}

export default useGalery;
