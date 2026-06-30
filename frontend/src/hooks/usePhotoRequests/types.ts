/**
 * Интегер для типа автора заявки на фотографии.
 */
export interface PhotoRequestAuthor {
  id: string;
  name: string;
  surname: string;
}

/**
 * Информация о заявке на фотографии.
 * @property publishing_id - Уникальный идентификатор заявки
 * @property author - Информация об авторе заявки
 * @property photos - Массив путей к фотографиям
 * @property created_at - Дата создания заявки (в формате ISO 8601)
 */
export interface PhotoRequestInfo {
  publishing_id: string;
  author: PhotoRequestAuthor;
  photos: Array<string>;
  created_at: string;
}

/**
 * Статус заявки на фотографии.
 * @property new - Новая заявка (ожидает рассмотрения)
 * @property rejected - Заявка отклонена
 * @property approved - Заявка одобрена
 */
export type PhotoRequestStatus = "new" | "rejected" | "approved";
