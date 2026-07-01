import 'dotenv/config';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
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
import { resendConfirmationEmail } from '../../utils/auth/resend-confirmation-email.test-util';
import {
  createUsersServiceConfirmByCodeSpy,
  createUsersServiceCreateSpy,
  createUsersServiceUpdateEmailConfirmationByEmailSpy,
} from '../../test-doubles/spies';
import {
  expiredUserEmailConfirmationData,
  invalidConfirmationCodes,
  invalidUserAgents,
  validUserAgents,
  validUUIDs,
} from '../../test-data/auth.test-data';
import {
  invalidUserEmails,
  invalidUserLogins,
  invalidUserPasswords,
  validUserEmails,
  validUserLogins,
} from '../../test-data/users.test-data';
import { delay } from '../../utils/common/delay.test-util';
import { setTimeout } from 'timers/promises';
import { createNodemailerAdapterSendMailSpyAndMock } from '../../test-doubles/spies-mocks';

describe('Auth Validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not register a user when an invalid body passed; 003. POST /api/auth/registration', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const testUserAgent: string = validUserAgents.userAgent_01;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const registerUserResponse_01: any = await registerUser(
      app,
      testUserAgent,
      { login: invalidUserLogins.login_01 },
      testStatus
    );

    const registerUserResponse_02: any = await registerUser(
      app,
      testUserAgent,
      { login: invalidUserLogins.login_02 },
      testStatus
    );

    const registerUserResponse_03: any = await registerUser(
      app,
      testUserAgent,
      { login: invalidUserLogins.login_03 },
      testStatus
    );

    const registerUserResponse_04: any = await registerUser(
      app,
      testUserAgent,
      { login: invalidUserLogins.login_04 },
      testStatus
    );

    const registerUserResponse_05: any = await registerUser(
      app,
      testUserAgent,
      { login: invalidUserLogins.login_05 },
      testStatus
    );

    await delay(5000);
    await setTimeout(5000);

    const registerUserResponse_06: any = await registerUser(
      app,
      testUserAgent,
      { login: invalidUserLogins.login_06 },
      testStatus
    );

    const registerUserResponse_07: any = await registerUser(
      app,
      testUserAgent,
      { password: invalidUserPasswords.password_01 },
      testStatus
    );

    const registerUserResponse_08: any = await registerUser(
      app,
      testUserAgent,
      { password: invalidUserPasswords.password_02 },
      testStatus
    );

    const registerUserResponse_09: any = await registerUser(
      app,
      testUserAgent,
      { password: invalidUserPasswords.password_03 },
      testStatus
    );

    const registerUserResponse_10: any = await registerUser(
      app,
      testUserAgent,
      { password: invalidUserPasswords.password_04 },
      testStatus
    );

    await delay(5000);
    await setTimeout(5000);

    const registerUserResponse_11: any = await registerUser(
      app,
      testUserAgent,
      { password: invalidUserPasswords.password_05 },
      testStatus
    );

    const registerUserResponse_12: any = await registerUser(
      app,
      testUserAgent,
      { password: invalidUserPasswords.password_06 },
      testStatus
    );

    const registerUserResponse_13: any = await registerUser(
      app,
      testUserAgent,
      { email: invalidUserEmails.email_01 },
      testStatus
    );

    const registerUserResponse_14: any = await registerUser(
      app,
      testUserAgent,
      { email: invalidUserEmails.email_02 },
      testStatus
    );

    const registerUserResponse_15: any = await registerUser(
      app,
      testUserAgent,
      { email: invalidUserEmails.email_03 },
      testStatus
    );

    await delay(5000);
    await setTimeout(5000);

    const registerUserResponse_16: any = await registerUser(
      app,
      testUserAgent,
      { email: invalidUserEmails.email_04 },
      testStatus
    );

    const registerUserResponse_17: any = await registerUser(
      app,
      testUserAgent,
      { email: invalidUserEmails.email_05 },
      testStatus
    );

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
    expect(nodemailerAdapterSendMailSpyAndMock).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).not.toHaveBeenCalled();
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  }, 35000);

  it('❌ 002 should not register a user when a non-unique login/email passed; 003. POST /api/auth/registration', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createdUser: UserOutputDTO = await createUser(app);
    const invalidCreateUserData_01: CreateUserInputDTO = getCreateUserInputDTO({ email: validUserEmails.email_01 });
    const invalidCreateUserData_02: CreateUserInputDTO = getCreateUserInputDTO({ login: validUserLogins.login_01 });
    const testUserAgent: string = validUserAgents.userAgent_01;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const registerUserResponse_01: any = await registerUser(app, testUserAgent, invalidCreateUserData_01, testStatus);
    const registerUserResponse_02: any = await registerUser(app, testUserAgent, invalidCreateUserData_02, testStatus);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(1);
    expect(getUserListResponse.totalCount).toBe(1);
    expect(getUserListResponse.items[0]).toEqual(createdUser);
    expect(registerUserResponse_01.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_01.errorsMessages[0].message).toBe('Field "login" must be unique');
    expect(registerUserResponse_02.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_02.errorsMessages[0].message).toBe('Field "email" must be unique');
    expect(nodemailerAdapterSendMailSpyAndMock).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 003 should not register a user when an invalid user agent passed; 003. POST /api/auth/registration', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await registerUser(app, invalidUserAgents.userAgent_01, getCreateUserInputDTO(), testStatus);
    await registerUser(app, invalidUserAgents.userAgent_02, getCreateUserInputDTO(), testStatus);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(0);
    expect(getUserListResponse.totalCount).toBe(0);
    expect(nodemailerAdapterSendMailSpyAndMock).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).not.toHaveBeenCalled();
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 004 should not register a user when a user agent not passed; 003. POST /api/auth/registration', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    await registerUser(app, validUserAgents.userAgent_01, getCreateUserInputDTO(), HttpStatuses.Unauthorized_401, true);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(0);
    expect(getUserListResponse.totalCount).toBe(0);
    expect(nodemailerAdapterSendMailSpyAndMock).not.toHaveBeenCalled();
    expect(usersServiceCreateSpy).not.toHaveBeenCalled();
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 005 should not register a user when more than 5 requests to the same URL during the last 10 seconds have been made; 003. POST /api/auth/registration', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();

    const createUserData_02: CreateUserInputDTO = getCreateUserInputDTO({
      login: validUserLogins.login_01,
      email: validUserEmails.email_01,
    });

    const createUserData_03: CreateUserInputDTO = getCreateUserInputDTO({
      login: validUserLogins.login_02,
      email: validUserEmails.email_02,
    });

    const createUserData_04: CreateUserInputDTO = getCreateUserInputDTO({
      login: validUserLogins.login_03,
      email: validUserEmails.email_03,
    });

    const createUserData_05: CreateUserInputDTO = getCreateUserInputDTO({
      login: validUserLogins.login_04,
      email: validUserEmails.email_04,
    });

    const createUserData_06: CreateUserInputDTO = getCreateUserInputDTO({
      login: validUserLogins.login_05,
      email: validUserEmails.email_05,
    });

    const createUserData_07: CreateUserInputDTO = getCreateUserInputDTO({
      login: validUserLogins.login_06,
      email: validUserEmails.email_06,
    });

    const createUserData_08: CreateUserInputDTO = getCreateUserInputDTO({
      login: validUserLogins.login_07,
      email: validUserEmails.email_07,
    });

    const testUserAgent: string = validUserAgents.userAgent_01;
    const testStatus: HttpStatuses = HttpStatuses.TooManyRequest_429;

    await registerUser(app, testUserAgent, createUserData_01);
    await registerUser(app, testUserAgent, createUserData_02);
    await registerUser(app, testUserAgent, createUserData_03);
    await registerUser(app, testUserAgent, createUserData_04);
    await registerUser(app, testUserAgent, createUserData_05);
    await registerUser(app, testUserAgent, createUserData_06, testStatus);
    await registerUser(app, testUserAgent, createUserData_07, testStatus);
    await delay(5000);
    await setTimeout(5000);
    await registerUser(app, testUserAgent, createUserData_08);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(6);
    expect(getUserListResponse.totalCount).toBe(6);
    expect(getUserListResponse.items[0].login).toEqual(validUserLogins.login_07);
    expect(getUserListResponse.items[0].email).toEqual(validUserEmails.email_07);
    expect(nodemailerAdapterSendMailSpyAndMock).toHaveBeenCalledTimes(6);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(6);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  }, 15000);

  it('❌ 006 should not confirm user registration when an invalid confirmation code passed; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const confirmUserByCodeResponse_01: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_01,
      testStatus
    );

    const confirmUserByCodeResponse_02: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_02,
      testStatus
    );

    const confirmUserByCodeResponse_03: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_03,
      testStatus
    );

    const confirmUserByCodeResponse_04: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_04,
      testStatus
    );

    const confirmUserByCodeResponse_05: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_05,
      testStatus
    );

    await delay(5000);
    await setTimeout(5000);

    const confirmUserByCodeResponse_06: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_06,
      testStatus
    );

    const confirmUserByCodeResponse_07: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_07,
      testStatus
    );

    const confirmUserByCodeResponse_08: any = await confirmUserByCode(
      app,
      testUserAgent,
      invalidConfirmationCodes.code_08,
      testStatus
    );

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
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
    expect(nodemailerAdapterSendMailSpyAndMock).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  }, 15000);

  it('❌ 007 should not confirm user registration when an incorrect confirmation code passed; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, getCreateUserInputDTO());
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const confirmUserByCodeResponse: any = await confirmUserByCode(app, testUserAgent, validUUIDs.uuid_01, testStatus);

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmUserByCodeResponse.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse.errorsMessages[0].message).toBe('Field "code" is invalid');
    expect(nodemailerAdapterSendMailSpyAndMock).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 008 should not confirm user registration without prior registration; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const confirmUserByCodeResponse: any = await confirmUserByCode(
      app,
      validUserAgents.userAgent_01,
      validUUIDs.uuid_01,
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

  it('❌ 009 should not confirm already confirmed user registration; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserDBConfirmationCode: string | undefined = createdUserDB?.emailConfirmation.confirmationCode;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await confirmUserByCode(app, testUserAgent, createdUserDBConfirmationCode);

    const confirmUserByCodeResponse: any = await confirmUserByCode(
      app,
      testUserAgent,
      createdUserDBConfirmationCode,
      HttpStatuses.BadRequest_400
    );

    const twiceConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const twiceConfirmedUserDBConfirmationCode: string | undefined =
      twiceConfirmedUserDB?.emailConfirmation.confirmationCode;

    expect(twiceConfirmedUserDB?.emailConfirmation.isConfirmed).toBeTruthy();
    expect(createdUserDBConfirmationCode).toBe(twiceConfirmedUserDBConfirmationCode);
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

  it('❌ 010 should not confirm user registration when an expired confirmation code passed; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();

    const createdUserResult: Result<{ createdUserId: string }> = await usersService.create(
      createUserData,
      expiredUserEmailConfirmationData
    );

    const createdUserId: string = createdUserResult.data.createdUserId;

    const confirmUserByCodeResponse: any = await confirmUserByCode(
      app,
      validUserAgents.userAgent_01,
      expiredUserEmailConfirmationData.confirmationCode,
      HttpStatuses.BadRequest_400
    );

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    expect(notConfirmedUserDB?.emailConfirmation.isConfirmed).toBeFalsy();
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

  it('❌ 011 should not confirm user registration when an invalid user agent passed; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserDBConfirmationCode: string | undefined = createdUserDB?.emailConfirmation.confirmationCode;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await confirmUserByCode(app, invalidUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus);
    await confirmUserByCode(app, invalidUserAgents.userAgent_02, createdUserDBConfirmationCode, testStatus);

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(nodemailerAdapterSendMailSpyAndMock).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 012 should not confirm user registration when a user agent not passed; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserDBConfirmationCode: string | undefined = createdUserDB?.emailConfirmation.confirmationCode;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus, true);

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(nodemailerAdapterSendMailSpyAndMock).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 013 should not confirm user registration when more than 5 requests to the same URL during the last 10 seconds have been made; 004. POST /api/auth/registration-confirmation', async () => {
    const nodemailerAdapterSendMailSpyAndMock = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserDBConfirmationCode: string | undefined = createdUserDB?.emailConfirmation.confirmationCode;
    const testStatus_01: HttpStatuses = HttpStatuses.BadRequest_400;
    const testStatus_02: HttpStatuses = HttpStatuses.TooManyRequest_429;

    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode);
    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus_01);
    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus_01);
    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus_01);
    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus_01);
    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus_02);
    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus_02);
    await delay(5000);
    await setTimeout(5000);
    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCode, testStatus_01);

    const confirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    expect(confirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(nodemailerAdapterSendMailSpyAndMock).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpyAndMock.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  }, 15000);

  it('❌ 014 should not resend a confirmation code when an invalid confirmation email passed; 005. POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const resendConfirmationEmailResponse_01: any = await resendConfirmationEmail(
      app,
      testUserAgent,
      invalidUserEmails.email_01,
      testStatus
    );

    const resendConfirmationEmailResponse_02: any = await resendConfirmationEmail(
      app,
      testUserAgent,
      invalidUserEmails.email_02,
      testStatus
    );

    const resendConfirmationEmailResponse_03: any = await resendConfirmationEmail(
      app,
      testUserAgent,
      invalidUserEmails.email_03,
      testStatus
    );

    const resendConfirmationEmailResponse_04: any = await resendConfirmationEmail(
      app,
      testUserAgent,
      invalidUserEmails.email_04,
      testStatus
    );

    const resendConfirmationEmailResponse_05: any = await resendConfirmationEmail(
      app,
      testUserAgent,
      invalidUserEmails.email_05,
      testStatus
    );

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
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 015 should not resend a confirmation code when an incorrect confirmation email passed; 005. POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const resendConfirmationEmailResponse: any = await resendConfirmationEmail(
      app,
      testUserAgent,
      validUserEmails.email_01,
      testStatus
    );

    expect(resendConfirmationEmailResponse.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 016 should not resend a confirmation code without prior registration; 005. POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const resendConfirmationEmailResponse: any = await resendConfirmationEmail(
      app,
      validUserAgents.userAgent_01,
      validUserEmails.email_01,
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

  it('❌ 017 should not resend a confirmation code when user registration already confirmed; 005. POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const createdUserEmail: string = createUserData.email;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserConfirmationCode: string | undefined = createdUserDB?.emailConfirmation.confirmationCode;
    await confirmUserByCode(app, testUserAgent, createdUserConfirmationCode);

    const resendConfirmationEmailResponse: any = await resendConfirmationEmail(
      app,
      testUserAgent,
      createdUserEmail,
      HttpStatuses.BadRequest_400
    );

    const confirmedUserDBAfterResending: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const confirmedUserDBAfterResendingConfirmationCode: string =
      confirmedUserDBAfterResending!.emailConfirmation.confirmationCode;

    expect(confirmedUserDBAfterResending?.emailConfirmation.isConfirmed).toBeTruthy();
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

  it('❌ 018 should not resend a confirmation code when an invalid user agent passed; 005. POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const createdUserEmail: string = createUserData.email;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserDBConfirmationCode: string | undefined = createdUserDB?.emailConfirmation.confirmationCode;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await resendConfirmationEmail(app, invalidUserAgents.userAgent_01, createdUserEmail, testStatus);
    await resendConfirmationEmail(app, invalidUserAgents.userAgent_02, createdUserEmail, testStatus);

    const createdUserDBAfterResending: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const createdUserDBAfterResendingConfirmationCode: string | undefined =
      createdUserDBAfterResending?.emailConfirmation.confirmationCode;

    expect(createdUserDBAfterResending?.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserDBConfirmationCode).toBe(createdUserDBAfterResendingConfirmationCode);
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 019 should not resend a confirmation code when a user agent not passed; 005. POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const createdUserEmail: string = createUserData.email;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserDBConfirmationCode: string | undefined = createdUserDB?.emailConfirmation.confirmationCode;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await resendConfirmationEmail(app, testUserAgent, createdUserEmail, testStatus, true);

    const createdUserDBAfterResending: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const createdUserDBAfterResendingConfirmationCode: string | undefined =
      createdUserDBAfterResending?.emailConfirmation.confirmationCode;

    expect(createdUserDBAfterResending?.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserDBConfirmationCode).toBe(createdUserDBAfterResendingConfirmationCode);
    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 020 should not resend a confirmation code when more than 5 requests to the same URL during the last 10 seconds have been made; 005. POST /api/auth/registration-email-resending', async () => {
    const nodemailerAdapterSendMailSpy = createNodemailerAdapterSendMailSpyAndMock();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();

    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserEmail: string = createUserData.email;
    const testUserAgent: string = validUserAgents.userAgent_01;
    await registerUser(app, testUserAgent, createUserData);
    const testStatus: HttpStatuses = HttpStatuses.TooManyRequest_429;

    await resendConfirmationEmail(app, testUserAgent, createdUserEmail);
    await resendConfirmationEmail(app, testUserAgent, createdUserEmail);
    await resendConfirmationEmail(app, testUserAgent, createdUserEmail);
    await resendConfirmationEmail(app, testUserAgent, createdUserEmail);
    await resendConfirmationEmail(app, testUserAgent, createdUserEmail);
    await resendConfirmationEmail(app, testUserAgent, createdUserEmail, testStatus);
    await resendConfirmationEmail(app, testUserAgent, createdUserEmail, testStatus);
    await delay(5000);
    await setTimeout(5000);
    await resendConfirmationEmail(app, testUserAgent, createdUserEmail);

    expect(nodemailerAdapterSendMailSpy).toHaveBeenCalledTimes(7);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).toHaveBeenCalledTimes(6);

    nodemailerAdapterSendMailSpy.mockRestore();
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  }, 15000);
});
