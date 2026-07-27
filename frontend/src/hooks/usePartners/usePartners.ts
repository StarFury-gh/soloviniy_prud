import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../../constants";

import type { Partner, GetPartnersServerResponse } from "./types";

interface usePartnersParams {
  page: number;
}

const PAGINATION_LIMIT = 3;

function usePartners(params: usePartnersParams) {
  const [partners, setPartners] = useState<Array<Partner>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    const offset = (params.page - 1) * PAGINATION_LIMIT;
    const queryParams = new URLSearchParams({
      limit: `${PAGINATION_LIMIT}`,
      offset: `${offset}`,
    });

    const url = `${API_URL}/partners/?${queryParams}`;

    const response = await fetch(url);

    if (response.ok) {
      const data: GetPartnersServerResponse = await response.json();
      console.log(data);
      setPartners((prev) => [...prev, ...data.partners]);
      setHasMore(data.partners.length >= PAGINATION_LIMIT);
    }
    setIsLoading(false);
  }, [params.page]);

  useEffect(() => {
    const fetch = () => {
      fetchPartners();
    };
    fetch();
  }, [params.page, fetchPartners]);

  return { partners, hasMore, isLoading, refresh: fetchPartners };
}

export default usePartners;
