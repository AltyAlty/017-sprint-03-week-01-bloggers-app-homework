import 'dotenv/config';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { createUser } from '../../utils/users/create-user.test-util';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { LoginDataInputDTO } from '../../../src/auth/routes/input-dto/login-data.input-dto';
import { MeOutputDTO } from '../../../src/auth/routes/output-dto/me.output-dto';
import { getAuthDataByAccessToken } from '../../utils/auth/get-auth-data-by-access-token.test-util';
import { invalidAccessTokens, invalidRefreshTokens } from '../../test-data/auth.test-data';
import { loginUserReturnAccessAndRefreshTokens } from '../../utils/auth/login-user-return-access-and-refresh-tokens.test-util';
import { refreshAccessAndRefreshTokens } from '../../utils/auth/refresh-access-and-refresh-tokens.test-util';
import { jwtAdapter } from '../../../src/auth/adapters/jwt.adapter';
import { SETTINGS } from '../../../src/core/settings/settings';
import { RefreshTokenDBType } from '../../../src/auth/repositories/types/refresh-token-db.type';
import { authRepository } from '../../../src/auth/repositories/auth.repository';
import { revokeRefreshToken } from '../../utils/auth/revoke-refresh-token.test-util';
import { invalidUserLoginsOrEmails, invalidUserPasswords } from '../../test-data/users.test-data';

describe('Auth API validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not authenticate a user when an invalid body passed; POST /api/auth/login', async () => {
    const validCreateUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, validCreateUserData);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    await loginUserReturnAccessToken(app, { loginOrEmail: invalidUserLoginsOrEmails.loginOrEmail_01 }, testStatus);
    await loginUserReturnAccessToken(app, { loginOrEmail: invalidUserLoginsOrEmails.loginOrEmail_02 }, testStatus);
    await loginUserReturnAccessToken(app, { loginOrEmail: invalidUserLoginsOrEmails.loginOrEmail_03 }, testStatus);
    await loginUserReturnAccessToken(app, { password: invalidUserPasswords.password_01 }, testStatus);
    await loginUserReturnAccessToken(app, { password: invalidUserPasswords.password_02 }, testStatus);
    await loginUserReturnAccessToken(app, { password: invalidUserPasswords.password_03 }, testStatus);
    await loginUserReturnAccessToken(app, { password: invalidUserPasswords.password_04 }, testStatus);
    await loginUserReturnAccessToken(app, { password: invalidUserPasswords.password_05 }, testStatus);
    await loginUserReturnAccessToken(app, { password: invalidUserPasswords.password_06 }, testStatus);
  });

  it('❌ 002 should not authenticate a user without valid credentials; POST /api/auth/login', async () => {
    const createUserData_01: CreateUserInputDTO = getCreateUserInputDTO();

    const createUserData_02: CreateUserInputDTO = {
      login: 'user02',
      password: 'zxc321QWE654',
      email: 'user02@example.com',
    };

    const createUserLogin_01: string = createUserData_01.login;
    const createUserEmail_01: string = createUserData_01.email;
    const createUserPassword_01: string = createUserData_01.password;
    const createUserLogin_02: string = createUserData_02.login;
    const createUserEmail_02: string = createUserData_02.email;
    const createUserPassword_02: string = createUserData_02.password;
    await Promise.all([createUser(app, createUserData_01), createUser(app, createUserData_02)]);
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await loginUserReturnAccessToken(
      app,
      { loginOrEmail: createUserLogin_02, password: createUserPassword_01 },
      testStatus
    );

    await loginUserReturnAccessToken(
      app,
      { loginOrEmail: createUserEmail_02, password: createUserPassword_01 },
      testStatus
    );

    await loginUserReturnAccessToken(
      app,
      { loginOrEmail: createUserLogin_01, password: createUserPassword_02 },
      testStatus
    );

    await loginUserReturnAccessToken(
      app,
      { loginOrEmail: createUserEmail_01, password: createUserPassword_02 },
      testStatus
    );
  });

  it('❌ 003 should not authenticate a user if concurrent token creation has been detected; POST /api/auth/login', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserEmail: string = createUserData.email;
    const createUserPassword: string = createUserData.password;
    await createUser(app, createUserData);
    const loginUserData_01: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };
    const loginUserData_02: LoginDataInputDTO = { loginOrEmail: createUserEmail, password: createUserPassword };

    await loginUserReturnAccessAndRefreshTokens(app, loginUserData_01);
    await loginUserReturnAccessAndRefreshTokens(app, loginUserData_02, HttpStatuses.BadRequest_400);
  });

  it('❌ 004 should not return user data without a valid access token; GET /api/auth/me', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserEmail: string = createUserData.email;
    const createUserPassword: string = createUserData.password;
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };
    const accessToken: string = await loginUserReturnAccessToken(app, loginUserData);
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_01, testStatus);
    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_02, testStatus);
    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_03, testStatus);
    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_04, testStatus);
    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_05, testStatus);
    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_06, testStatus);
    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_07, testStatus);
    await getAuthDataByAccessToken(app, invalidAccessTokens.AT_08, testStatus);

    const authCreatedUserData: MeOutputDTO = await getAuthDataByAccessToken(app, accessToken);

    expect(authCreatedUserData).toEqual({
      login: createUserLogin,
      email: createUserEmail,
      userId: createdUser.id,
    });
  });

  it('❌ 005 should not create new AT/RT without a valid refresh token; POST /api/auth/refresh-token', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const { refreshToken: oldRefreshToken }: { refreshToken: string } = await loginUserReturnAccessAndRefreshTokens(
      app,
      loginUserData
    );

    const randomRefreshTokenNotInDB: string = await jwtAdapter.createAccessToken(
      '1',
      SETTINGS.RT_SECRET!,
      SETTINGS.RT_TIME!
    );
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await refreshAccessAndRefreshTokens(app, undefined, undefined, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_01, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_02, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_03, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_04, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_05, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_06, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_07, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, invalidRefreshTokens.RT_08, testStatus);
    await refreshAccessAndRefreshTokens(app, undefined, randomRefreshTokenNotInDB, testStatus);

    const oldRefreshTokenDB: RefreshTokenDBType | null = await authRepository.findRT(oldRefreshToken);
    expect(oldRefreshTokenDB).not.toBeNull();
    expect(oldRefreshTokenDB?.blacklisted).toBeFalsy();
  });

  it('❌ 006 should not create new AT/RT when a blacklisted refresh token passed; POST /api/auth/refresh-token', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const { refreshToken: oldRefreshToken }: { refreshToken: string } = await loginUserReturnAccessAndRefreshTokens(
      app,
      loginUserData
    );

    await authRepository.blacklistRT(oldRefreshToken);
    await refreshAccessAndRefreshTokens(app, undefined, oldRefreshToken, HttpStatuses.Unauthorized_401);
  });

  it('❌ 007 should not create new AT/RT if concurrent token creation has been detected; POST /api/auth/refresh-token', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const { refreshTokenCookieString }: { refreshTokenCookieString: string } =
      await loginUserReturnAccessAndRefreshTokens(app, loginUserData);

    await refreshAccessAndRefreshTokens(app, refreshTokenCookieString, undefined, HttpStatuses.BadRequest_400);
  });

  it('❌ 008 should not revoke an invalid refresh token; POST /api/auth/logout', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const { refreshToken: oldRefreshToken }: { refreshToken: string } = await loginUserReturnAccessAndRefreshTokens(
      app,
      loginUserData
    );

    const randomRefreshTokenNotInDB: string = await jwtAdapter.createAccessToken(
      '1',
      SETTINGS.RT_SECRET!,
      SETTINGS.RT_TIME!
    );
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await revokeRefreshToken(app, undefined, undefined, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_01, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_02, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_03, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_04, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_05, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_06, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_07, testStatus);
    await revokeRefreshToken(app, undefined, invalidRefreshTokens.RT_08, testStatus);
    await revokeRefreshToken(app, undefined, randomRefreshTokenNotInDB, testStatus);

    const oldRefreshTokenDB: RefreshTokenDBType | null = await authRepository.findRT(oldRefreshToken);
    expect(oldRefreshTokenDB).not.toBeNull();
    expect(oldRefreshTokenDB?.blacklisted).toBeFalsy();
  });

  it('❌ 009 should not revoke a blacklisted refresh token; POST /api/auth/logout', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const { refreshToken: oldRefreshToken }: { refreshToken: string } = await loginUserReturnAccessAndRefreshTokens(
      app,
      loginUserData
    );

    await authRepository.blacklistRT(oldRefreshToken);
    await revokeRefreshToken(app, undefined, oldRefreshToken, HttpStatuses.Unauthorized_401);
  });
});
