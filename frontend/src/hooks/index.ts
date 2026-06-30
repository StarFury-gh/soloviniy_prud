import useAuth from "./useAuth";
import useStoryTags from "./useStoryTags";
import useStoriesRequests from "./useStoriesRequests";
import useEvents from "./useEvents/";
import useGalery from "./useGalery";
import useStories from "./useStories";
import usePhotoRequests from "./usePhotoRequests";

/**
 * Модуль хуков для работы с различными аспекта��и приложения.
 *
 * @module hooks
 *
 * @description
 * Экспортирует хуки для работы с различными аспектами приложения:
 * - `useAuth` — аутентификация и управление сессией пользователя
 * - `useEvents` — получение и отображение событий/мероприятий
 * - `useStories` — управление заявками на истории
 * - `useStoryTags` — получение списка доступных тегов для историй
 * - `usePhotoRequests` — получение и управление заявками на фотографии
 *
 * @example
 * ```tsx
 * import { useAuth, useEvents, useStories, useStoryTags, usePhotoRequests } from '@/hooks';
 *
 * // Использование хуков в компоненте
 * const authStatus = useAuth();
 * const { events } = useEvents({ status: "future", page: 1 });
 * const { stories } = useStories({ status: "new", page: 1 });
 * const tags = useStoryTags();
 * const { requests, isLoading, hasMore } = usePhotoRequests({ status: "new", page: 1 });
 * ```
 */

export {
  useAuth,
  useStoryTags,
  useStoriesRequests,
  useEvents,
  useGalery,
  useStories,
  usePhotoRequests,
};
