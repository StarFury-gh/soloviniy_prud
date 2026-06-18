import { useState, useEffect } from "react";
import { API_URL, LS_ACCESS_TOKEN } from "../../constants";
import type { AuthStatus, JWTPayload } from "./types";

function useAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    status: false,
    loading: true,
  });

  const token = localStorage.getItem(LS_ACCESS_TOKEN);
  const url = `${API_URL}/users/auth`;

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setAuthStatus({ status: false, loading: false });
        return;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const message =
            errorData.message || `HTTP error! status: ${response.status}`;
          throw new Error(message);
        }

        const user = (await response.json()) as JWTPayload;

        setAuthStatus({ status: true, user, loading: false });
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem(LS_ACCESS_TOKEN);
        setAuthStatus({ status: false, loading: false });
      }
    }

    checkAuth();
  }, [token, url]);

  return authStatus;
}

export default useAuth;
