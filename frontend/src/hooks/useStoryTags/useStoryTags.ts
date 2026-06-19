import { useState, useEffect } from "react";

import { API_URL } from "../../constants";

import type { TagFromServer, GetTagsServerResponse, Tag } from "./types";

const _mapServerTagsToFront = (
  serverTags: Array<TagFromServer>,
): Array<Tag> => {
  return serverTags.map((tag) => {
    return { tagId: tag.id, tagName: tag.name };
  });
};

function useStoryTags() {
  const [availableTags, setAvailableTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const url = `${API_URL}/stories/tags`;
      const response = await fetch(url);
      if (response.ok) {
        const { tags }: GetTagsServerResponse = await response.json();
        const mappedTags = _mapServerTagsToFront(tags);
        setAvailableTags(mappedTags);
      }
    };
    fetchTags();
  }, []);
  return availableTags;
}

export default useStoryTags;
