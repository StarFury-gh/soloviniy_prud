export interface RequestInfo {
  id: number;
  author_id: string;
  title: string;
  content: string;
  images: Array<string>;
  created_at: string;
  tags: Array<string>;
}

export type RequestStatus = "new" | "rejected" | "approved";
