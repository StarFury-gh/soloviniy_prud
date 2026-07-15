interface Socials {
  social: string;
  url: string;
}

export interface PartnerRequest {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
  socials: Array<Socials>;
  created_at: string;
}
