/**
 * Роли пользователей в системе.
 * @property admin - Администратор (имеет расширенные права)
 * @property user - Обычный пользователь
 */
type UserRoles = "admin" | "user";

/**
 * Полезная нагрузка JWT-токена с данными пользователя.
 * @property id - Уникальный идентификатор пользователя
 * @property email - Электронная почта пользователя
 * @property role - Роль пользователя (admin или user)
 */
interface JWTPayload {
  id: string;
  email: string;
  role: UserRoles;
}

/**
 * Текущее состояние аутентификации пользователя.
 * @property status - true если пользователь авторизован, иначе false
 * @property user - Данные пользователя (опционально, присутствует при авторизации)
 * @property loading - true пока идет проверка токена
 * @property error - Сообщение об ошибке (опционально)
 */
interface AuthStatus {
  status: boolean;
  user?: JWTPayload;
  loading: boolean;
  error?: string;
}

export type { UserRoles, JWTPayload, AuthStatus };
