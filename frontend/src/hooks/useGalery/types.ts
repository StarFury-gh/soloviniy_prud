interface PublicationAuthor {
  id: string;
  name: string;
  surname: string;
}

export interface GetPhotosServerResponse {
  publications: Array<GaleryPublication>;
}

export interface GaleryPublication {
  publication_id: string;
  author: PublicationAuthor;
  photos: Array<string>;
}
