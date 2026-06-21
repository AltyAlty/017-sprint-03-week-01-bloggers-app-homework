import 'dotenv/config';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { PaginatedUserListOutputDTO } from '../../../src/users/routes/output-dto/paginated-user-list.output-dto';
import { getUserList } from '../../utils/users/get-user-list.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { registerUser } from '../../utils/auth/register-user.test-util';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { createUser } from '../../utils/users/create-user.test-util';
import { usersService } from '../../../src/users/application/users.service';
import { Result } from '../../../src/core/types/result/result.type';
import { UserDBType } from '../../../src/users/repositories/types/user-db.type';
import { usersRepository } from '../../../src/users/repositories/users.repository';
import { confirmUserByCode } from '../../utils/auth/confirm-user-by-code.test-util';
import { EmailConfirmationType } from '../../../src/users/application/types/user.type';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { resendConfirmationEmail } from '../../utils/auth/resend-confirmation-email.test-util';
import {
  createNodemailerAdapterSendMailSpy,
  createUsersServiceConfirmByCodeSpy,
  createUsersServiceCreateSpy,
  createUsersServiceUpdateEmailConfirmationByEmailSpy,
} from '../../test-doubles/spies';
import { invalidConfirmationCodes } from '../../test-data/auth.test-data';
import { invalidUserEmails, invalidUserLogins, invalidUserPasswords } from '../../test-data/users.test-data';

describe('Auth Validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not register a user when an invalid body passed; POST /api/auth/registration', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const registerUserResponse_01: any = await registerUser(app, { login: invalidUserLogins.login_01 }, testStatus);
    const registerUserResponse_02: any = await registerUser(app, { login: invalidUserLogins.login_02 }, testStatus);
    const registerUserResponse_03: any = await registerUser(app, { login: invalidUserLogins.login_03 }, testStatus);
    const registerUserResponse_04: any = await registerUser(app, { login: invalidUserLogins.login_04 }, testStatus);
    const registerUserResponse_05: any = await registerUser(app, { login: invalidUserLogins.login_05 }, testStatus);
    const registerUserResponse_06: any = await registerUser(app, { login: invalidUserLogins.login_06 }, testStatus);

    const registerUserResponse_07: any = await registerUser(
      app,
      { password: invalidUserPasswords.password_01 },
      testStatus
    );

    const registerUserResponse_08: any = await registerUser(
      app,
      { password: invalidUserPasswords.password_02 },
      testStatus
    );

    const registerUserResponse_09: any = await registerUser(
      app,
      { password: invalidUserPasswords.password_03 },
      testStatus
    );

    const registerUserResponse_10: any = await registerUser(
      app,
      { password: invalidUserPasswords.password_04 },
      testStatus
    );

    const registerUserResponse_11: any = await registerUser(
      app,
      { password: invalidUserPasswords.password_05 },
      testStatus
    );

    const registerUserResponse_12: any = await registerUser(
      app,
      { password: invalidUserPasswords.password_06 },
      testStatus
    );

    const registerUserResponse_13: any = await registerUser(app, { email: invalidUserEmails.email_01 }, testStatus);
    const registerUserResponse_14: any = await registerUser(app, { email: invalidUserEmails.email_02 }, testStatus);
    const registerUserResponse_15: any = await registerUser(app, { email: invalidUserEmails.email_03 }, testStatus);
    const registerUserResponse_16: any = await registerUser(app, { email: invalidUserEmails.email_04 }, testStatus);
    const registerUserResponse_17: any = await registerUser(app, { email: invalidUserEmails.email_05 }, testStatus);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(0);
    expect(getUserListResponse.totalCount).toBe(0);

    expect(registerUserResponse_01.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_01.errorsMessages[0].message).toBe('Field "login" must not be empty');
    expect(registerUserResponse_02.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_02.errorsMessages[0].message).toBe('Field "login" must not be empty');
    expect(registerUserResponse_03.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_03.errorsMessages[0].message).toBe('Field "login" must be between 3 and 10 characters');
    expect(registerUserResponse_04.errorsMessages[0].field).toBe('login');

    expect(registerUserResponse_04.errorsMessages[0].message).toBe(
      'Field "login" can only contain letters, numbers, underscores and hyphens'
    );

    expect(registerUserResponse_05.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_05.errorsMessages[0].message).toBe('Field "login" must be between 3 and 10 characters');
    expect(registerUserResponse_06.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_06.errorsMessages[0].message).toBe('Field "login" must be a string');
    expect(registerUserResponse_07.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_07.errorsMessages[0].message).toBe('Field "password" must not be empty');
    expect(registerUserResponse_08.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_08.errorsMessages[0].message).toBe('Field "password" must not be empty');
    expect(registerUserResponse_09.errorsMessages[0].field).toBe('password');

    expect(registerUserResponse_09.errorsMessages[0].message).toBe(
      'Field "password" must be between 6 and 20 characters'
    );

    expect(registerUserResponse_10.errorsMessages[0].field).toBe('password');

    expect(registerUserResponse_10.errorsMessages[0].message).toBe(
      'Field "password" must be between 6 and 20 characters'
    );

    expect(registerUserResponse_11.errorsMessages[0].field).toBe('password');

    expect(registerUserResponse_11.errorsMessages[0].message).toBe(
      'Field "password" must be between 6 and 20 characters'
    );

    expect(registerUserResponse_12.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_12.errorsMessages[0].message).toBe('Field "password" must be a string');
    expect(registerUserResponse_13.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_13.errorsMessages[0].message).toBe('Field "email" must not be empty');
    expect(registerUserResponse_14.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_14.errorsMessages[0].message).toBe('Field "email" must not be empty');
    expect(registerUserResponse_15.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_15.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(registerUserResponse_16.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_16.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(registerUserResponse_17.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_17.errorsMessages[0].message).toBe('Field "email" must be a string');
    expect(nodemailerAdapterSendMailSpy).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).not.toHaveBeenCalled();
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 002 should not register a user when a non-unique login/email passed; POST /api/auth/registration', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const validCreateUserData: CreateUserInputDTO = {
      login: 'user01',
      password: 'qwe123ZXC456',
      email: 'user01@example.com',
    };

    const invalidCreateUserData_01: CreateUserInputDTO = { ...validCreateUserData, email: 'user02@example.com' };
    const invalidCreateUserData_02: CreateUserInputDTO = { ...validCreateUserData, login: 'user03' };
    const createdUser: UserOutputDTO = await createUser(app, validCreateUserData);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const registerUserResponse_01: any = await registerUser(app, invalidCreateUserData_01, testStatus);
    const registerUserResponse_02: any = await registerUser(app, invalidCreateUserData_02, testStatus);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(1);
    expect(getUserListResponse.totalCount).toBe(1);
    expect(getUserListResponse.items[0]).toEqual(createdUser);
    expect(registerUserResponse_01.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_01.errorsMessages[0].message).toBe('Field "login" must be unique');
    expect(registerUserResponse_02.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_02.errorsMessages[0].message).toBe('Field "email" must be unique');
    expect(nodemailerAdapterSendMailSpy).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 003 should not confirm user registration when an invalid confirmation code passed; POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const confirmUserByCodeResponse_01: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_01,
      testStatus
    );

    const confirmUserByCodeResponse_02: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_02,
      testStatus
    );

    const confirmUserByCodeResponse_03: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_03,
      testStatus
    );

    const confirmUserByCodeResponse_04: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_04,
      testStatus
    );

    const confirmUserByCodeResponse_05: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_05,
      testStatus
    );

    const confirmUserByCodeResponse_06: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_06,
      testStatus
    );

    const confirmUserByCodeResponse_07: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_07,
      testStatus
    );

    const confirmUserByCodeResponse_08: any = await confirmUserByCode(
      app,
      invalidConfirmationCodes.code_08,
      testStatus
    );

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmUserByCodeResponse_01.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_01.errorsMessages[0].message).toBe('Field "code" must not be empty');
    expect(confirmUserByCodeResponse_02.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_02.errorsMessages[0].message).toBe('Field "code" must not be empty');
    expect(confirmUserByCodeResponse_03.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_03.errorsMessages[0].message).toBe('Field "code" is invalid');
    expect(confirmUserByCodeResponse_04.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_04.errorsMessages[0].message).toBe('Field "code" is invalid');
    expect(confirmUserByCodeResponse_05.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_05.errorsMessages[0].message).toBe('Field "code" is invalid');
    expect(confirmUserByCodeResponse_06.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_06.errorsMessages[0].message).toBe('Field "code" must be a string');
    expect(confirmUserByCodeResponse_07.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_07.errorsMessages[0].message).toBe('Field "code" is required');
    expect(confirmUserByCodeResponse_08.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_08.errorsMessages[0].message).toBe('Field "code" must be a string');
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 004 should not confirm user registration without prior registration; POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const confirmationCodeAsValidUUID: string = '11111111-1111-1111-1111-111111111111';

    const confirmUserByCodeResponse: any = await confirmUserByCode(
      app,
      confirmationCodeAsValidUUID,
      HttpStatuses.BadRequest_400
    );

    expect(confirmUserByCodeResponse.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse.errorsMessages[0].message).toBe('Field "code" is invalid');
    expect(nodemailerAdapterSendMailSpy).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).not.toHaveBeenCalled();
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 005 should not confirm already confirmed user registration; POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserConfirmationCode: string = createdUserDB!.emailConfirmation.confirmationCode;
    await confirmUserByCode(app, createdUserConfirmationCode);
    const confirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const confirmUserByCodeResponse: any = await confirmUserByCode(
      app,
      createdUserConfirmationCode,
      HttpStatuses.BadRequest_400
    );

    const twiceConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const twiceConfirmedUserConfirmationCode: string = twiceConfirmedUserDB!.emailConfirmation.confirmationCode;

    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(twiceConfirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(createdUserConfirmationCode).toBe(twiceConfirmedUserConfirmationCode);
    expect(confirmUserByCodeResponse.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse.errorsMessages[0].message).toBe('Registration has already been confirmed');
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 006 should not confirm user registration by an expired confirmation code; POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();

    const userEmailConfirmationData: EmailConfirmationType = {
      isConfirmed: false,
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { seconds: -1 }),
    };

    const createdUserResult: Result<{ userId: string }> = await usersService.create(
      createUserData,
      userEmailConfirmationData
    );

    const createdUserId: string = createdUserResult.data.userId;
    const createdUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    const createdUserConfirmationCode: string = createdUserDB!.emailConfirmation.confirmationCode;

    const confirmUserByCodeResponse: any = await confirmUserByCode(
      app,
      createdUserConfirmationCode,
      HttpStatuses.BadRequest_400
    );

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmUserByCodeResponse.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse.errorsMessages[0].message).toBe('Confirmation code is expired');
    expect(nodemailerAdapterSendMailSpy).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 007 should not resend a confirmation code when an invalid confirmation email passed; POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const resendConfirmationEmailResponse_01: any = await resendConfirmationEmail(
      app,
      invalidUserEmails.email_01,
      testStatus
    );

    const resendConfirmationEmailResponse_02: any = await resendConfirmationEmail(
      app,
      invalidUserEmails.email_02,
      testStatus
    );

    const resendConfirmationEmailResponse_03: any = await resendConfirmationEmail(
      app,
      invalidUserEmails.email_03,
      testStatus
    );

    const resendConfirmationEmailResponse_04: any = await resendConfirmationEmail(
      app,
      invalidUserEmails.email_04,
      testStatus
    );

    const resendConfirmationEmailResponse_05: any = await resendConfirmationEmail(
      app,
      invalidUserEmails.email_05,
      testStatus
    );

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(resendConfirmationEmailResponse_01.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_01.errorsMessages[0].message).toBe('Field "email" must not be empty');
    expect(resendConfirmationEmailResponse_02.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_02.errorsMessages[0].message).toBe('Field "email" must not be empty');
    expect(resendConfirmationEmailResponse_03.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_03.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(resendConfirmationEmailResponse_04.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_04.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(resendConfirmationEmailResponse_05.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_05.errorsMessages[0].message).toBe('Field "email" must be a string');
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 008 should not resend a confirmation code without prior registration; POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const validEmail: string = 'user01@example.com';

    const resendConfirmationEmailResponse: any = await resendConfirmationEmail(
      app,
      validEmail,
      HttpStatuses.BadRequest_400
    );

    expect(resendConfirmationEmailResponse.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(nodemailerAdapterSendMailSpy).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).not.toHaveBeenCalled();
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 009 should not resend a confirmation code for already confirmed user registration; POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpy();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const createdUserEmail: string = createUserData.email;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserConfirmationCode: string = createdUserDB!.emailConfirmation.confirmationCode;
    await confirmUserByCode(app, createdUserConfirmationCode);
    const confirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const resendConfirmationEmailResponse: any = await resendConfirmationEmail(
      app,
      createdUserEmail,
      HttpStatuses.BadRequest_400
    );

    const confirmedUserDBAfterResending: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const confirmedUserDBAfterResendingConfirmationCode: string =
      confirmedUserDBAfterResending!.emailConfirmation.confirmationCode;

    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(confirmedUserDBAfterResending!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(createdUserConfirmationCode).toBe(confirmedUserDBAfterResendingConfirmationCode);
    expect(resendConfirmationEmailResponse.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse.errorsMessages[0].message).toBe('Registration has already been confirmed');
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });
});
