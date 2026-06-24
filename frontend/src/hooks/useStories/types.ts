//id: int
// author: StoryAuthor
// content: str
// created_at: datetime | None = None
// tags: List[str]
// images: List[str | None]

interface StoryAuthor {
  id: string;
  name: string;
  surname: string;
}

export interface Story {
  id: number;
  author: StoryAuthor;
  content: string;
  created_at: string;
  tags: Array<string>;
  images: Array<string>;
}
