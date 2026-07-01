import 'dotenv/config';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { createUser } from '../../utils/users/create-user.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { PaginatedUserListOutputDTO } from '../../../src/users/routes/output-dto/paginated-user-list.output-dto';
import { getUserList } from '../../utils/users/get-user-list.test-util';
import { deleteUserById } from '../../utils/users/delete-user-by-id.test-util';
import {
  invalidUserEmails,
  invalidUserIds,
  invalidUserLogins,
  invalidUserPasswords,
  invalidUsersPaginationSettings,
  validUserData,
  validUserEmails,
  validUserLogins,
  validUsersPaginationSettings,
} from '../../test-data/users.test-data';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { invalidBasicAuthTokens } from '../../test-data/auth.test-data';

describe('Users API validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not create a user without proper basic authorization; 002. POST /api/users', async () => {
    await createUser(app, undefined, HttpStatuses.Unauthorized_401, invalidBasicAuthTokens.BAT_01);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(0);
    expect(getUserListResponse.totalCount).toBe(0);
  });

  it('❌ 002 should not create a user when an invalid body passed; 002. POST /api/users', async () => {
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createUserResponse_01: any = await createUser(app, { login: invalidUserLogins.login_01 }, testStatus);
    const createUserResponse_02: any = await createUser(app, { login: invalidUserLogins.login_02 }, testStatus);
    const createUserResponse_03: any = await createUser(app, { login: invalidUserLogins.login_03 }, testStatus);
    const createUserResponse_04: any = await createUser(app, { login: invalidUserLogins.login_04 }, testStatus);
    const createUserResponse_05: any = await createUser(app, { login: invalidUserLogins.login_05 }, testStatus);
    const createUserResponse_06: any = await createUser(app, { login: invalidUserLogins.login_06 }, testStatus);

    const createUserResponse_07: any = await createUser(
      app,
      { password: invalidUserPasswords.password_01 },
      testStatus
    );

    const createUserResponse_08: any = await createUser(
      app,
      { password: invalidUserPasswords.password_02 },
      testStatus
    );

    const createUserResponse_09: any = await createUser(
      app,
      { password: invalidUserPasswords.password_03 },
      testStatus
    );

    const createUserResponse_10: any = await createUser(
      app,
      { password: invalidUserPasswords.password_04 },
      testStatus
    );

    const createUserResponse_11: any = await createUser(
      app,
      { password: invalidUserPasswords.password_05 },
      testStatus
    );

    const createUserResponse_12: any = await createUser(
      app,
      { password: invalidUserPasswords.password_06 },
      testStatus
    );

    const createUserResponse_13: any = await createUser(app, { email: invalidUserEmails.email_01 }, testStatus);
    const createUserResponse_14: any = await createUser(app, { email: invalidUserEmails.email_02 }, testStatus);
    const createUserResponse_15: any = await createUser(app, { email: invalidUserEmails.email_03 }, testStatus);
    const createUserResponse_16: any = await createUser(app, { email: invalidUserEmails.email_04 }, testStatus);
    const createUserResponse_17: any = await createUser(app, { email: invalidUserEmails.email_05 }, testStatus);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(0);
    expect(getUserListResponse.totalCount).toBe(0);
    expect(createUserResponse_01.errorsMessages[0].field).toBe('login');
    expect(createUserResponse_01.errorsMessages[0].message).toBe('Field "login" must not be empty');
    expect(createUserResponse_02.errorsMessages[0].field).toBe('login');
    expect(createUserResponse_02.errorsMessages[0].message).toBe('Field "login" must not be empty');
    expect(createUserResponse_03.errorsMessages[0].field).toBe('login');
    expect(createUserResponse_03.errorsMessages[0].message).toBe('Field "login" must be between 3 and 10 characters');
    expect(createUserResponse_04.errorsMessages[0].field).toBe('login');

    expect(createUserResponse_04.errorsMessages[0].message).toBe(
      'Field "login" can only contain letters, numbers, underscores and hyphens'
    );

    expect(createUserResponse_05.errorsMessages[0].field).toBe('login');
    expect(createUserResponse_05.errorsMessages[0].message).toBe('Field "login" must be between 3 and 10 characters');
    expect(createUserResponse_06.errorsMessages[0].field).toBe('login');
    expect(createUserResponse_06.errorsMessages[0].message).toBe('Field "login" must be a string');
    expect(createUserResponse_07.errorsMessages[0].field).toBe('password');
    expect(createUserResponse_07.errorsMessages[0].message).toBe('Field "password" must not be empty');
    expect(createUserResponse_08.errorsMessages[0].field).toBe('password');
    expect(createUserResponse_08.errorsMessages[0].message).toBe('Field "password" must not be empty');
    expect(createUserResponse_09.errorsMessages[0].field).toBe('password');

    expect(createUserResponse_09.errorsMessages[0].message).toBe(
      'Field \"password\" must be between 6 and 20 characters'
    );

    expect(createUserResponse_10.errorsMessages[0].field).toBe('password');

    expect(createUserResponse_10.errorsMessages[0].message).toBe(
      'Field \"password\" must be between 6 and 20 characters'
    );

    expect(createUserResponse_11.errorsMessages[0].field).toBe('password');

    expect(createUserResponse_11.errorsMessages[0].message).toBe(
      'Field \"password\" must be between 6 and 20 characters'
    );

    expect(createUserResponse_12.errorsMessages[0].field).toBe('password');
    expect(createUserResponse_12.errorsMessages[0].message).toBe('Field "password" must be a string');
    expect(createUserResponse_13.errorsMessages[0].field).toBe('email');
    expect(createUserResponse_13.errorsMessages[0].message).toBe('Field "email" must not be empty');
    expect(createUserResponse_14.errorsMessages[0].field).toBe('email');
    expect(createUserResponse_14.errorsMessages[0].message).toBe('Field "email" must not be empty');
    expect(createUserResponse_15.errorsMessages[0].field).toBe('email');
    expect(createUserResponse_15.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(createUserResponse_16.errorsMessages[0].field).toBe('email');
    expect(createUserResponse_16.errorsMessages[0].message).toBe('Field "email" is invalid');
    expect(createUserResponse_17.errorsMessages[0].field).toBe('email');
    expect(createUserResponse_17.errorsMessages[0].message).toBe('Field "email" must be a string');
  });

  it('❌ 003 should not create a user when a non-unique login/email passed; 002. POST /api/users', async () => {
    const validCreateUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const invalidCreateUserData_01: CreateUserInputDTO = getCreateUserInputDTO({ email: validUserEmails.email_01 });
    const invalidCreateUserData_02: CreateUserInputDTO = getCreateUserInputDTO({ login: validUserLogins.login_01 });
    const createdUser: UserOutputDTO = await createUser(app, validCreateUserData);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createUserResponse_01: any = await createUser(app, invalidCreateUserData_01, testStatus);
    const createUserResponse_02: any = await createUser(app, invalidCreateUserData_02, testStatus);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(1);
    expect(getUserListResponse.totalCount).toBe(1);
    expect(getUserListResponse.items[0]).toEqual(createdUser);
    expect(createUserResponse_01.errorsMessages[0].field).toBe('login');
    expect(createUserResponse_01.errorsMessages[0].message).toBe('Field "login" must be unique');
    expect(createUserResponse_02.errorsMessages[0].field).toBe('email');
    expect(createUserResponse_02.errorsMessages[0].message).toBe('Field "email" must be unique');
  });

  it('❌ 004 should not return a list of users without proper basic authorization; 001. GET /api/users', async () => {
    await Promise.all([createUser(app), createUser(app)]);

    await getUserList(app, undefined, HttpStatuses.Unauthorized_401, invalidBasicAuthTokens.BAT_01);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(2);
    expect(getUserListResponse.totalCount).toBe(2);
  });

  it('❌ 005 should not return a list of users when invalid pagination settings passed; 001. GET /api/users', async () => {
    const validUrl: string = `${SETTINGS.USERS_PATH}?pageSize=${validUsersPaginationSettings.pageSize}&pageNumber=${validUsersPaginationSettings.pageNumber}&searchLoginTerm=${validUsersPaginationSettings.searchLoginTerm}&searchEmailTerm=${validUsersPaginationSettings.searchEmailTerm}&sortDirection=${validUsersPaginationSettings.sortDirection}&sortBy=${validUsersPaginationSettings.sortBy}`;
    const invalidUrl_01: string = `${SETTINGS.USERS_PATH}?pageSize=${invalidUsersPaginationSettings.pageSize}&pageNumber=${validUsersPaginationSettings.pageNumber}&searchLoginTerm=${validUsersPaginationSettings.searchLoginTerm}&searchEmailTerm=${validUsersPaginationSettings.searchEmailTerm}&sortDirection=${validUsersPaginationSettings.sortDirection}&sortBy=${validUsersPaginationSettings.sortBy}`;
    const invalidUrl_02: string = `${SETTINGS.USERS_PATH}?pageSize=${validUsersPaginationSettings.pageSize}&pageNumber=${invalidUsersPaginationSettings.pageNumber}&searchLoginTerm=${validUsersPaginationSettings.searchLoginTerm}&searchEmailTerm=${validUsersPaginationSettings.searchEmailTerm}&sortDirection=${validUsersPaginationSettings.sortDirection}&sortBy=${validUsersPaginationSettings.sortBy}`;
    const invalidUrl_03: string = `${SETTINGS.USERS_PATH}?pageSize=${validUsersPaginationSettings.pageSize}&pageNumber=${validUsersPaginationSettings.pageNumber}&searchLoginTerm=${validUsersPaginationSettings.searchLoginTerm}&searchEmailTerm=${validUsersPaginationSettings.searchEmailTerm}&sortDirection=${invalidUsersPaginationSettings.sortDirection}&sortBy=${validUsersPaginationSettings.sortBy}`;
    const invalidUrl_04: string = `${SETTINGS.USERS_PATH}?pageSize=${validUsersPaginationSettings.pageSize}&pageNumber=${validUsersPaginationSettings.pageNumber}&searchLoginTerm=${validUsersPaginationSettings.searchLoginTerm}&searchEmailTerm=${validUsersPaginationSettings.searchEmailTerm}&sortDirection=${validUsersPaginationSettings.sortDirection}&sortBy=${invalidUsersPaginationSettings.sortBy}`;

    await Promise.all([
      createUser(app, validUserData.data_01),
      createUser(app, validUserData.data_02),
      createUser(app, validUserData.data_03),
      createUser(app, validUserData.data_04),
      createUser(app, validUserData.data_05),
      createUser(app, validUserData.data_06),
    ]);

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getUserListResponse_01: any = await getUserList(app, invalidUrl_01, testStatus);
    const getUserListResponse_02: any = await getUserList(app, invalidUrl_02, testStatus);
    const getUserListResponse_03: any = await getUserList(app, invalidUrl_03, testStatus);
    const getUserListResponse_04: any = await getUserList(app, invalidUrl_04, testStatus);

    expect(getUserListResponse_01.errorsMessages[0].field).toBe('pageSize');

    expect(getUserListResponse_01.errorsMessages[0].message).toBe(
      'Field "pageSize" must be between 1 and 100 characters'
    );

    expect(getUserListResponse_02.errorsMessages[0].field).toBe('pageNumber');
    expect(getUserListResponse_02.errorsMessages[0].message).toBe('Field "pageNumber" must be a positive integer');
    expect(getUserListResponse_03.errorsMessages[0].field).toBe('sortDirection');
    expect(getUserListResponse_03.errorsMessages[0].message).toBe('Field "sortDirection" must be: asc, desc');
    expect(getUserListResponse_04.errorsMessages[0].field).toBe('sortBy');
    expect(getUserListResponse_04.errorsMessages[0].message).toBe('Field "sortBy" must be: createdAt, login, email');
    const getUserListResponse_05: PaginatedUserListOutputDTO = await getUserList(app, validUrl);
    expect(getUserListResponse_05.items).toBeInstanceOf(Array);
    expect(getUserListResponse_05.items.length).toBe(3);
    expect(getUserListResponse_05.totalCount).toBe(3);
    expect(getUserListResponse_05.items[0].login).toBe(validUserData.data_06.login);
    expect(getUserListResponse_05.items[1].login).toBe(validUserData.data_04.login);
    expect(getUserListResponse_05.items[2].login).toBe(validUserData.data_03.login);
  });

  it('❌ 006 should not delete a user by ID without proper basic authorization; 003. DELETE /api/users/:id', async () => {
    const createdUser: UserOutputDTO = await createUser(app);
    const createdUserId: string = createdUser.id;

    await deleteUserById(app, createdUserId, HttpStatuses.Unauthorized_401, invalidBasicAuthTokens.BAT_01);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(1);
    expect(getUserListResponse.totalCount).toBe(1);
    expect(getUserListResponse.items[0]).toEqual(createdUser);
  });

  it('❌ 007 should not delete a user by invalid ID; 003. DELETE /api/users/:id', async () => {
    const createdUser: UserOutputDTO = await createUser(app);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const deleteUserByIdResponse_01: any = await deleteUserById(app, invalidUserIds.id_01, testStatus);
    const deleteUserByIdResponse_02: any = await deleteUserById(app, invalidUserIds.id_02, testStatus);
    const deleteUserByIdResponse_03: any = await deleteUserById(app, invalidUserIds.id_03, testStatus);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(1);
    expect(getUserListResponse.totalCount).toBe(1);
    expect(getUserListResponse.items[0]).toEqual(createdUser);
    expect(deleteUserByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(deleteUserByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deleteUserByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(deleteUserByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deleteUserByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(deleteUserByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });
});
