import { usersService } from '../../src/users/application/users.service';

/*Шпион для метода "usersService.create()".*/
export const createUsersServiceCreateSpy = () => jest.spyOn(usersService, 'create');
export const createUsersServiceConfirmByCodeSpy = () => jest.spyOn(usersService, 'confirmByCode');

export const createUsersServiceUpdateEmailConfirmationByEmailSpy = () => {
  return jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
};
