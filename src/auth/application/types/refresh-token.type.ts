/*Тип для RT.*/
export type RefreshTokenType = {
  token: string;
  expirationDate: Date;
  blacklisted: boolean;
  /*Нужно для TTL в MongoDB.*/
  createdAt: Date;
};
