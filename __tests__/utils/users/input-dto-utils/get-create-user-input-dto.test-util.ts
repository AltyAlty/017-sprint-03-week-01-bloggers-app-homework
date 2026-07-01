import { CreateUserInputDTO } from '../../../../src/users/routes/input-dto/create-user.input-dto';

export const getCreateUserInputDTO = (userDTO?: Partial<CreateUserInputDTO>): CreateUserInputDTO => {
  return {
    login: userDTO?.login ?? 'user01',
    password: userDTO?.password ?? 'qwe123ZXC456',
    email: userDTO?.email ?? 'user01@example.com',
  };
};
