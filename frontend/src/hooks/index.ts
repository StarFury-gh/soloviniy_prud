import useAuth from "./useAuth";
import useStoryTags from "./useStoryTags";
import useStories from "./useStories";
import useEvents from "./useEvents/";

/**
 * Модуль хуков для работы с различными аспектами приложения.
 *
 * @module hooks
 *
 * @description
 * Экспортирует хуки для работы с различными аспектами приложения:
 * - `useAuth` — аутентификация и управление сессией пользователя
 * - `useEvents` — получение и отображение событий/мероприятий
 * - `useStories` — управление заявками на истории
 * - `useStoryTags` — получение списка доступных тегов для историй
 *
 * @example
 * ```tsx
 * import { useAuth, useEvents, useStories, useStoryTags } from '@/hooks';
 *
 * // Использование хуков в компоненте
 * const authStatus = useAuth();
 * const { events } = useEvents({ status: "future", page: 1 });
 * const { stories } = useStories({ status: "new", page: 1 });
 * const tags = useStoryTags();
 * ```
 */

export { useAuth, useStoryTags, useStories, useEvents };
