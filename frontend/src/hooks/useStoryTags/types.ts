export interface TagFromServer {
  id: number;
  name: string;
}

export interface GetTagsServerResponse {
  tags: Array<TagFromServer>;
}

export interface Tag {
  tagId: number;
  tagName: string;
}
