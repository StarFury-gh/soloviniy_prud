interface Socials {
  social: string;
  url: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
  socials: Array<Socials>;
  trusted: boolean;
}

export interface GetPartnersServerResponse {
  partners: Array<Partner>;
}
