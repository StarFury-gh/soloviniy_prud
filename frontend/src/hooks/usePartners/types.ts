export interface Partner {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
}

export interface GetPartnersServerResponse {
  partners: Array<Partner>;
}
