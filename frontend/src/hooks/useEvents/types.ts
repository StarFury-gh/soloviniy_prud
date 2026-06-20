export interface PrudEvent {
  id: number;
  name: string;
  description: string;
  date: string;
}

export type EventStatus = "past" | "future";
