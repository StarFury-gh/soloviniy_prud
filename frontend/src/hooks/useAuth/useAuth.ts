import { useState, useEffect } from "react";
import { API_URL, LS_ACCESS_TOKEN } from "../../constants";
import type { AuthStatus, JWTPayload } from "./types";

/**
 * Хук для проверки и управления состоянием аутентификации пользователя.
 *
 * @description
 * Этот хук выполняет следующие задачи:
 * - Получает токен доступа из localStorage
 * - Проверяет валидность токена, отправляя запрос на сервер
 * - Возвращает текущее состояние аутентификации (статус, пользователь, флаг загрузки)
 * - При недействительном токене автоматически удаляет его из localStorage
 *
 * @returns {Object} Объект с состоянием аутентификации:
 * - `status`: boolean — true если пользователь авторизован, иначе false
 * - `user`: JWTPayload | undefined — данные пользователя (id, email, role), если авторизован
 * - `loading`: boolean — true пока идет проверка токена
 * - `error`: string | undefined — сообщение об ошибке (если есть)
 *
 * @example
 * ```tsx
 * const authStatus = useAuth();
 *
 * if (authStatus.loading) {
 *   return <Spinner />;
 * }
 *
 * if (authStatus.status) {
 *   return <Component user={authStatus.user} />;
 * }
 *
 * return <LoginForm />;
 * ```
 */
function useAuth(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    status: false,
    loading: true,
  });

  const token = localStorage.getItem(LS_ACCESS_TOKEN);
  const url = `${API_URL}/users/auth/`;

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
