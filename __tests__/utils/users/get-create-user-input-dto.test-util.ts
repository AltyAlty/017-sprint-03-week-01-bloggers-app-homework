import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';

export const getCreateUserInputDTO = (): CreateUserInputDTO => {
  return {
    login: 'user01',
    password: 'qwe123ZXC456',
    email: 'user01@example.com',
  };
};
