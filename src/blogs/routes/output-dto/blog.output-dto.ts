/*Output DTO для блога.*/
export type BlogOutputDTO = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};
