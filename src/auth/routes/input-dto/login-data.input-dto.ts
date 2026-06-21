/*Input DTO для аутентификации пользователя по логину или email.*/
export type LoginDataInputDTO = {
  loginOrEmail: string;
  password: string;
};
