/**
 * Событие (приветствие/мероприятие) в системе.
 * @property id - Уникальный идентификатор события
 * @property name - Название события
 * @property description - Описание события
 * @property date - Дата события (в формате ISO 8601)
 */
export interface PrudEvent {
  id: number;
  name: string;
  description: string;
  date: string;
  path?: string | null;
}

/**
 * Статус события.
 * @property past - Прошедшее событие
 * @property future - Будущее событие
 */
export type EventStatus = "past" | "future";
