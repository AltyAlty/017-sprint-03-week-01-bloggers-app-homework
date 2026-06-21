/*Тип для поля "emailConfirmation" в типе "UserType".*/
export type EmailConfirmationType = {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: Date;
};

/*Тип для пользователя.*/
export type UserType = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmationType;
};
