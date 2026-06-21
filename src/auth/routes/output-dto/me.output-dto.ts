/*Output DTO для объекта с данными о пользователе, получаемого по токену.*/
export type MeOutputDTO = {
  login: string;
  email: string;
  userId: string;
};
