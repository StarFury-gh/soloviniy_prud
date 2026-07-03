interface StoryAuthor {
  id: string;
  name: string;
  surname: string;
}

export interface Story {
  id: number;
  author: StoryAuthor;
  title: string;
  content: string;
  created_at: string;
  tags: Array<string>;
  images: Array<string>;
}

type TagId = number;

export interface UseStoriesProps {
  page: number;
  tags?: Array<TagId>;
}
