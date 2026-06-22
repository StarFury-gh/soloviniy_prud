import { useState, useEffect } from "react";

import { API_URL } from "../../constants";

import type { TagFromServer, GetTagsServerResponse, Tag } from "./types";

/**
 * Хук для получения списка доступных тегов для историй.
 *
 * @description
 * Хук загружает список всех доступных тегов с сервера при первом рендеринге.
 * Теги используются для категоризации и фильтрации историй.
 * Данные кэшируются в состоянии компонента и не обновляются автоматически при изменении.
 *
 * @returns {Object} Массив доступных тегов:
 * - `tagId`: number — Уникальный идентификатор тега
 * - `tagName`: string — Название тега (для отображения)
 *
 * @example
 * ```tsx
 * const availableTags = useStoryTags();
 *
 * return (
 *   <div>
 *     {availableTags.map(tag => (
 *       <TagBadge key={tag.tagId} label={tag.tagName} />
 *     ))}
 *   </div>
 * );
 * ```
 */
function useStoryTags() {
  const [availableTags, setAvailableTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const url = `${API_URL}/stories/tags/`;
      const response = await fetch(url);
      if (response.ok) {
        const { tags }: GetTagsServerResponse = await response.json();
        const mappedTags = serverTagsToFront(tags);
        setAvailableTags(mappedTags);
      }
    };
    fetchTags();
  }, []);
  return availableTags;
}

/**
 * Вспомогательная функция для преобразования тегов из формата сервера в формат приложения.
{"text": " * @param {Array<TagFromServer>} serverTags - Массив тегов, полученных от сервера"}
 * @returns {Array<Tag>} Массив тегов в формате приложения
 */
const serverTagsToFront = (serverTags: Array<TagFromServer>): Array<Tag> => {
  return serverTags.map((tag) => {
    return { tagId: tag.id, tagName: tag.name };
  });
};

export default useStoryTags;
