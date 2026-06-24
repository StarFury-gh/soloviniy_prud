export interface StoryAuthor {
  name: string;
  surname: string;
}

/**
 * Информация о заявке на историю.
 * @property id - Уникальный идентификатор заявки
 * @property author_id - ID автора заявки
 * @property title - Заголовок истории
 * @property content - Текст содержания истории
 * @property images - Массив URL изображений
 * @property created_at - Дата создания заявки (в формате ISO 8601)
 * @property tags - Массив тегов, связанных с историей
 */
export interface RequestInfo {
  id: number;
  author: StoryAuthor;
  title: string;
  content: string;
  images: Array<string>;
  created_at: string;
  tags: Array<string>;
}

/**
 * Статус заявки на историю.
 * @property new - Новая заявка (ожидает рассмотрения)
 * @property rejected - Заявка отклонена
 * @property approved - Заявка одобрена
 */
export type RequestStatus = "new" | "rejected" | "approved";
