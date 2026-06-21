import { usersService } from '../../src/users/application/users.service';
import { nodemailerAdapter } from '../../src/auth/adapters/nodemailer.adapter';

/*Шпион для метода "usersService.create()".*/
export const createUsersServiceCreateSpy = () => jest.spyOn(usersService, 'create');
export const createUsersServiceConfirmByCodeSpy = () => jest.spyOn(usersService, 'confirmByCode');

export const createUsersServiceUpdateEmailConfirmationByEmailSpy = () => {
  return jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
};

export const createNodemailerAdapterSendMailSpy = () => {
  return jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
};
