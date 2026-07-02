/**
 * Рубрика для категоризации историй (формат сервера).
 * @property id - Уникальный идентификатор рубрики
 * @property name - Название рубрики
 */
export interface TagFromServer {
  id: number;
  name: string;
}

/**
 * Ответ от сервера со списком рубрик.
 * @property tags - Массив рубрик
 */
export interface GetTagsServerResponse {
  tags: Array<TagFromServer>;
}

/**
 * Рубрика для категоризации историй (формат приложения).
 * @property tagId - Уникальный идентификатор рубрики
 * @property tagName - Название рубрики (для отображения)
 */
export interface Tag {
  tagId: number;
  tagName: string;
}
