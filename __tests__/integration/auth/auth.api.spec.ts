import 'dotenv/config';
import { createUser } from '../../utils/users/create-user.test-util';
import { jwtAdapter } from '../../../src/auth/adapters/jwt.adapter';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { LoginDataInputDTO } from '../../../src/auth/routes/input-dto/login-data.input-dto';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { getAuthDataByAccessToken } from '../../utils/auth/get-auth-data-by-access-token.test-util';
import { MeOutputDTO } from '../../../src/auth/routes/output-dto/me.output-dto';
import { SETTINGS } from '../../../src/core/settings/settings';
import { loginUserReturnAccessAndRefreshTokens } from '../../utils/auth/login-user-return-access-and-refresh-tokens.test-util';
import { refreshAccessAndRefreshTokens } from '../../utils/auth/refresh-access-and-refresh-tokens.test-util';
import { authRepository } from '../../../src/auth/repositories/auth.repository';
import { RefreshTokenDBType } from '../../../src/auth/repositories/types/refresh-token-db.type';
import { revokeRefreshToken } from '../../utils/auth/revoke-refresh-token.test-util';
import { delay } from '../../utils/common/delay.test-util';
import { setTimeout } from 'timers/promises';

describe('Auth API', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should authenticate a user when valid login and password passed; POST /api/auth/login', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const {
      accessToken,
      refreshToken,
      hasHttpOnly,
      hasSecure,
      hasPath,
    }: {
      accessToken: string;
      refreshToken: string;
      hasHttpOnly: boolean;
      hasSecure: boolean;
      hasPath: boolean;
    } = await loginUserReturnAccessAndRefreshTokens(app, loginUserData);

    const decodedAccessToken: { userId: string } | null = await jwtAdapter.verifyToken(
      accessToken,
      SETTINGS.AT_SECRET!
    );

    const decodedRefreshToken: { userId: string } | null = await jwtAdapter.verifyToken(
      refreshToken,
      SETTINGS.RT_SECRET!
    );

    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(3);
    expect(refreshToken.length).toBeGreaterThan(3);
    expect(hasHttpOnly).toBeTruthy();
    expect(hasSecure).toBeTruthy();
    expect(hasPath).toBeTruthy();
    expect(decodedAccessToken).not.toBeNull();
    expect(decodedRefreshToken).not.toBeNull();
    expect(decodedAccessToken!.userId).toBe(createdUserId);
    expect(decodedRefreshToken!.userId).toBe(createdUserId);
  });

  it('✅ 002 should authenticate a user when valid email and password passed; POST /api/auth/login', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserEmail: string = createUserData.email;
    const createUserPassword: string = createUserData.password;
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserEmail, password: createUserPassword };

    const {
      accessToken,
      refreshToken,
      hasHttpOnly,
      hasSecure,
      hasPath,
    }: {
      accessToken: string;
      refreshToken: string;
      hasHttpOnly: boolean;
      hasSecure: boolean;
      hasPath: boolean;
    } = await loginUserReturnAccessAndRefreshTokens(app, loginUserData);

    const decodedAccessToken: { userId: string } | null = await jwtAdapter.verifyToken(
      accessToken,
      SETTINGS.AT_SECRET!
    );

    const decodedRefreshToken: { userId: string } | null = await jwtAdapter.verifyToken(
      refreshToken,
      SETTINGS.RT_SECRET!
    );

    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(3);
    expect(refreshToken.length).toBeGreaterThan(3);
    expect(hasHttpOnly).toBeTruthy();
    expect(hasSecure).toBeTruthy();
    expect(hasPath).toBeTruthy();
    expect(decodedAccessToken).not.toBeNull();
    expect(decodedRefreshToken).not.toBeNull();
    expect(decodedAccessToken!.userId).toBe(createdUserId);
    expect(decodedRefreshToken!.userId).toBe(createdUserId);
  });

  it('✅ 003 should return user data when a valid access token passed; GET /api/auth/me', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserEmail: string = createUserData.email;
    const createUserPassword: string = createUserData.password;
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };
    const accessToken: string = await loginUserReturnAccessToken(app, loginUserData);

    const authCreatedUserData: MeOutputDTO = await getAuthDataByAccessToken(app, accessToken);

    expect(authCreatedUserData).toEqual({
      login: createUserLogin,
      email: createUserEmail,
      userId: createdUser.id,
    });
  });

  it('✅ 004 should create new AT/RT when a valid refresh token passed; POST /api/auth/refresh-token', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const {
      refreshToken: oldRefreshToken,
      refreshTokenCookieString,
    }: {
      refreshToken: string;
      refreshTokenCookieString: string;
    } = await loginUserReturnAccessAndRefreshTokens(app, loginUserData);

    await delay(1000);
    await setTimeout(1000);

    const {
      newAccessToken,
      newRefreshToken,
      hasHttpOnly,
      hasSecure,
      hasPath,
    }: {
      newAccessToken: string;
      newRefreshToken: string;
      hasHttpOnly: boolean;
      hasSecure: boolean;
      hasPath: boolean;
    } = await refreshAccessAndRefreshTokens(app, refreshTokenCookieString);

    const decodedNewAccessToken: { userId: string } | null = await jwtAdapter.verifyToken(
      newAccessToken,
      SETTINGS.AT_SECRET!
    );

    const decodedNewRefreshToken: { userId: string } | null = await jwtAdapter.verifyToken(
      newRefreshToken,
      SETTINGS.RT_SECRET!
    );

    expect(typeof newAccessToken).toBe('string');
    expect(typeof newRefreshToken).toBe('string');
    expect(newAccessToken.length).toBeGreaterThan(3);
    expect(newRefreshToken.length).toBeGreaterThan(3);
    expect(hasHttpOnly).toBeTruthy();
    expect(hasSecure).toBeTruthy();
    expect(hasPath).toBeTruthy();
    expect(decodedNewAccessToken).not.toBeNull();
    expect(decodedNewRefreshToken).not.toBeNull();
    expect(decodedNewAccessToken!.userId).toBe(createdUserId);
    expect(decodedNewRefreshToken!.userId).toBe(createdUserId);
    const oldRefreshTokenDB: RefreshTokenDBType | null = await authRepository.findRT(oldRefreshToken);
    expect(oldRefreshTokenDB).not.toBeNull();
    expect(oldRefreshTokenDB?.blacklisted).toBeTruthy();
  });

  it('✅ 005 should revoke a valid refresh token; POST /api/auth/logout', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };

    const {
      refreshToken: oldRefreshToken,
      refreshTokenCookieString,
    }: {
      refreshToken: string;
      refreshTokenCookieString: string;
    } = await loginUserReturnAccessAndRefreshTokens(app, loginUserData);

    await revokeRefreshToken(app, refreshTokenCookieString);

    const oldRefreshTokenDB: RefreshTokenDBType | null = await authRepository.findRT(oldRefreshToken);
    expect(oldRefreshTokenDB).not.toBeNull();
    expect(oldRefreshTokenDB?.blacklisted).toBeTruthy();
  });
});
