/**
 * Тег для категоризации историй (формат сервера).
 * @property id - Уникальный идентификатор тега
 * @property name - Название тега
 */
export interface TagFromServer {
  id: number;
  name: string;
}

/**
 * Ответ от сервера со списком тегов.
 * @property tags - Массив тегов
 */
export interface GetTagsServerResponse {
  tags: Array<TagFromServer>;
}

/**
 * Тег для категоризации историй (формат приложения).
 * @property tagId - Уникальный идентификатор тега
 * @property tagName - Название тега (для отображения)
 */
export interface Tag {
  tagId: number;
  tagName: string;
}
