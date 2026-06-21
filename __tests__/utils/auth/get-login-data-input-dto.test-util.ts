import { LoginDataInputDTO } from '../../../src/auth/routes/input-dto/login-data.input-dto';

export const getLoginDataInputDTO = (): LoginDataInputDTO => {
  return {
    loginOrEmail: 'user01',
    password: 'password001',
  };
};
