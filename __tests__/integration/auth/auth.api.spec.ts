import 'dotenv/config';
import { createUser } from '../../utils/users/create-user.test-util';
import { jwtAdapter } from '../../../src/auth/adapters/jwt.adapter';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
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
import { revokeSession } from '../../utils/auth/revoke-session.test-util';
import { delay } from '../../utils/common/delay.test-util';
import { setTimeout } from 'timers/promises';
import { getSecurityDeviceList } from '../../utils/security-devices/get-security-device-list.test-util';
import { SecurityDeviceListOutputDTO } from '../../../src/security-devices/routes/output-dto/security-device-list.output-dto';
import { authRepository } from '../../../src/auth/repositories/auth.repository';
import { SessionDBType } from '../../../src/auth/repositories/types/session-db.type';
import { SecurityDeviceOutputDTO } from '../../../src/security-devices/routes/output-dto/security-device.output-dto';
import { validUserAgents } from '../../test-data/auth.test-data';

describe('Auth API', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should authenticate a user when correct login and password passed; 001. POST /api/auth/login', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserData.login, password: createUserData.password };
    const testUserAgent: string = validUserAgents.userAgent_01;

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
    } = await loginUserReturnAccessAndRefreshTokens(app, testUserAgent, loginUserData);

    const verifiedAccessTokenPayload: { userId: string } | null = await jwtAdapter.verifyAccessToken(
      accessToken,
      SETTINGS.AT_SECRET!
    );

    const verifiedAccessTokenPayloadUserId: string | undefined = verifiedAccessTokenPayload?.userId;

    const verifiedRefreshTokenPayload: { userId: string; deviceId: string } | null =
      await jwtAdapter.verifyRefreshToken(refreshToken, SETTINGS.RT_SECRET!);

    const verifiedRefreshTokenPayloadUserId: string | undefined = verifiedRefreshTokenPayload?.userId;
    const verifiedRefreshTokenPayloadDeviceId: string | undefined = verifiedRefreshTokenPayload?.deviceId;

    const decodedAccessTokenPayload: { userId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeAccessToken(accessToken);

    const decodedAccessTokenPayloadUserId: string | undefined = decodedAccessTokenPayload?.userId;
    const decodedAccessTokenPayloadIat: number | undefined = decodedAccessTokenPayload?.iat;
    const decodedAccessTokenPayloadExp: number | undefined = decodedAccessTokenPayload?.exp;
    const decodedAccessTokenPayloadIatDate: Date = new Date(decodedAccessTokenPayloadIat! * 1000);
    const decodedAccessTokenPayloadExpDate: Date = new Date(decodedAccessTokenPayloadExp! * 1000);

    const decodedRefreshTokenPayload: { userId: string; deviceId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeRefreshToken(refreshToken);

    const decodedRefreshTokenPayloadUserId: string | undefined = decodedRefreshTokenPayload?.userId;
    const decodedRefreshTokenPayloadDeviceId: string | undefined = decodedRefreshTokenPayload?.deviceId;
    const decodedRefreshTokenPayloadIat: number | undefined = decodedRefreshTokenPayload?.iat;
    const decodedRefreshTokenPayloadExp: number | undefined = decodedRefreshTokenPayload?.exp;
    const decodedRefreshTokenPayloadIatDate: Date = new Date(decodedRefreshTokenPayloadIat! * 1000);
    const decodedRefreshTokenPayloadExpDate: Date = new Date(decodedRefreshTokenPayloadExp! * 1000);
    const sessions: SessionDBType[] | null = await authRepository.findAllSessionsByUserId(createdUserId);
    const session = sessions![0];
    const sessionUserId: string = session.userId;
    const sessionDeviceId: string = session.deviceId;
    const sessionDeviceName: string = session.deviceName;
    const sessionIp: string = session.ip;
    const sessionIat: Date = session.iat;
    const sessionExp: Date = session.exp;

    const getSecurityDeviceListResponse: SecurityDeviceListOutputDTO = await getSecurityDeviceList(
      app,
      testUserAgent,
      refreshToken
    );

    const securityDevice: SecurityDeviceOutputDTO | undefined = getSecurityDeviceListResponse[0];
    const securityDeviceId: string = securityDevice.deviceId;
    const securityDeviceTitle: string = securityDevice.title;
    const securityDeviceIp: string = securityDevice.ip;
    const securityDeviceLastActiveDate: Date = new Date(securityDevice.lastActiveDate);
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(3);
    expect(refreshToken.length).toBeGreaterThan(3);
    expect(hasHttpOnly).toBeTruthy();
    expect(hasSecure).toBeTruthy();
    expect(hasPath).toBeTruthy();
    expect(verifiedAccessTokenPayload).not.toBeNull();
    expect(verifiedAccessTokenPayload).not.toEqual(verifiedRefreshTokenPayload);
    expect(verifiedAccessTokenPayloadUserId).toBe(createdUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(verifiedRefreshTokenPayloadUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(decodedAccessTokenPayloadUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(decodedRefreshTokenPayloadUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(sessionUserId);
    expect(verifiedRefreshTokenPayload).not.toBeNull();
    expect(verifiedRefreshTokenPayloadDeviceId).toBe(decodedRefreshTokenPayloadDeviceId);
    expect(verifiedRefreshTokenPayloadDeviceId).toBe(sessionDeviceId);
    expect(verifiedRefreshTokenPayloadDeviceId).toBe(securityDeviceId);
    expect(decodedAccessTokenPayload).not.toBeNull();
    expect(decodedAccessTokenPayload).not.toEqual(decodedRefreshTokenPayload);
    expect(decodedAccessTokenPayloadIatDate).toEqual(decodedRefreshTokenPayloadIatDate);
    expect(decodedAccessTokenPayloadIatDate).toEqual(sessionIat);
    expect(decodedAccessTokenPayloadIatDate).toEqual(securityDeviceLastActiveDate);
    expect(decodedAccessTokenPayloadExpDate).not.toEqual(decodedRefreshTokenPayloadExpDate);
    expect(decodedAccessTokenPayloadExpDate).not.toEqual(sessionExp);
    expect(decodedRefreshTokenPayload).not.toBeNull();
    expect(decodedRefreshTokenPayloadExpDate).toEqual(sessionExp);
    expect(sessions).toBeInstanceOf(Array);
    expect(sessions!.length).toBe(1);
    expect(session).not.toBeNull();
    expect(sessionDeviceName).toBe(testUserAgent);
    expect(sessionDeviceName).toBe(securityDeviceTitle);
    expect(sessionIp).toBe(securityDeviceIp);
    expect(getSecurityDeviceListResponse).toBeInstanceOf(Array);
    expect(getSecurityDeviceListResponse.length).toBe(1);
    expect(securityDevice).not.toBeUndefined();
  });

  it('✅ 002 should authenticate a user when correct email and password passed; 001. POST /api/auth/login', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserData.email, password: createUserData.password };
    const testUserAgent: string = validUserAgents.userAgent_01;

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
    } = await loginUserReturnAccessAndRefreshTokens(app, testUserAgent, loginUserData);

    const verifiedAccessTokenPayload: { userId: string } | null = await jwtAdapter.verifyAccessToken(
      accessToken,
      SETTINGS.AT_SECRET!
    );

    const verifiedAccessTokenPayloadUserId: string | undefined = verifiedAccessTokenPayload?.userId;

    const verifiedRefreshTokenPayload: { userId: string; deviceId: string } | null =
      await jwtAdapter.verifyRefreshToken(refreshToken, SETTINGS.RT_SECRET!);

    const verifiedRefreshTokenPayloadUserId: string | undefined = verifiedRefreshTokenPayload?.userId;
    const verifiedRefreshTokenPayloadDeviceId: string | undefined = verifiedRefreshTokenPayload?.deviceId;

    const decodedAccessTokenPayload: { userId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeAccessToken(accessToken);

    const decodedAccessTokenPayloadUserId: string | undefined = decodedAccessTokenPayload?.userId;
    const decodedAccessTokenPayloadIat: number | undefined = decodedAccessTokenPayload?.iat;
    const decodedAccessTokenPayloadExp: number | undefined = decodedAccessTokenPayload?.exp;
    const decodedAccessTokenPayloadIatDate: Date = new Date(decodedAccessTokenPayloadIat! * 1000);
    const decodedAccessTokenPayloadExpDate: Date = new Date(decodedAccessTokenPayloadExp! * 1000);

    const decodedRefreshTokenPayload: { userId: string; deviceId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeRefreshToken(refreshToken);

    const decodedRefreshTokenPayloadUserId: string | undefined = decodedRefreshTokenPayload?.userId;
    const decodedRefreshTokenPayloadDeviceId: string | undefined = decodedRefreshTokenPayload?.deviceId;
    const decodedRefreshTokenPayloadIat: number | undefined = decodedRefreshTokenPayload?.iat;
    const decodedRefreshTokenPayloadExp: number | undefined = decodedRefreshTokenPayload?.exp;
    const decodedRefreshTokenPayloadIatDate: Date = new Date(decodedRefreshTokenPayloadIat! * 1000);
    const decodedRefreshTokenPayloadExpDate: Date = new Date(decodedRefreshTokenPayloadExp! * 1000);
    const sessions: SessionDBType[] | null = await authRepository.findAllSessionsByUserId(createdUserId);
    const session = sessions![0];
    const sessionUserId: string = session.userId;
    const sessionDeviceId: string = session.deviceId;
    const sessionDeviceName: string = session.deviceName;
    const sessionIp: string = session.ip;
    const sessionIat: Date = session.iat;
    const sessionExp: Date = session.exp;

    const getSecurityDeviceListResponse: SecurityDeviceListOutputDTO = await getSecurityDeviceList(
      app,
      testUserAgent,
      refreshToken
    );

    const securityDevice: SecurityDeviceOutputDTO | undefined = getSecurityDeviceListResponse[0];
    const securityDeviceId: string = securityDevice.deviceId;
    const securityDeviceTitle: string = securityDevice.title;
    const securityDeviceIp: string = securityDevice.ip;
    const securityDeviceLastActiveDate: Date = new Date(securityDevice.lastActiveDate);
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(3);
    expect(refreshToken.length).toBeGreaterThan(3);
    expect(hasHttpOnly).toBeTruthy();
    expect(hasSecure).toBeTruthy();
    expect(hasPath).toBeTruthy();
    expect(verifiedAccessTokenPayload).not.toBeNull();
    expect(verifiedAccessTokenPayload).not.toEqual(verifiedRefreshTokenPayload);
    expect(verifiedAccessTokenPayloadUserId).toBe(createdUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(verifiedRefreshTokenPayloadUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(decodedAccessTokenPayloadUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(decodedRefreshTokenPayloadUserId);
    expect(verifiedAccessTokenPayloadUserId).toBe(sessionUserId);
    expect(verifiedRefreshTokenPayload).not.toBeNull();
    expect(verifiedRefreshTokenPayloadDeviceId).toBe(decodedRefreshTokenPayloadDeviceId);
    expect(verifiedRefreshTokenPayloadDeviceId).toBe(sessionDeviceId);
    expect(verifiedRefreshTokenPayloadDeviceId).toBe(securityDeviceId);
    expect(decodedAccessTokenPayload).not.toBeNull();
    expect(decodedAccessTokenPayload).not.toEqual(decodedRefreshTokenPayload);
    expect(decodedAccessTokenPayloadIatDate).toEqual(decodedRefreshTokenPayloadIatDate);
    expect(decodedAccessTokenPayloadIatDate).toEqual(sessionIat);
    expect(decodedAccessTokenPayloadIatDate).toEqual(securityDeviceLastActiveDate);
    expect(decodedAccessTokenPayloadExpDate).not.toEqual(decodedRefreshTokenPayloadExpDate);
    expect(decodedAccessTokenPayloadExpDate).not.toEqual(sessionExp);
    expect(decodedRefreshTokenPayload).not.toBeNull();
    expect(decodedRefreshTokenPayloadExpDate).toEqual(sessionExp);
    expect(sessions).toBeInstanceOf(Array);
    expect(sessions!.length).toBe(1);
    expect(session).not.toBeNull();
    expect(sessionDeviceName).toBe(testUserAgent);
    expect(sessionDeviceName).toBe(securityDeviceTitle);
    expect(sessionIp).toBe(securityDeviceIp);
    expect(getSecurityDeviceListResponse).toBeInstanceOf(Array);
    expect(getSecurityDeviceListResponse.length).toBe(1);
    expect(securityDevice).not.toBeUndefined();
  });

  it('✅ 003 should create new AT/RT when a correct refresh token passed; 006. POST /api/auth/refresh-token', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserData.login, password: createUserData.password };
    const testUserAgent: string = validUserAgents.userAgent_01;

    const {
      accessToken: oldAccessToken,
      refreshToken: oldRefreshToken,
    }: { accessToken: string; refreshToken: string } = await loginUserReturnAccessAndRefreshTokens(
      app,
      testUserAgent,
      loginUserData
    );

    const verifiedOldAccessTokenPayload: { userId: string } | null = await jwtAdapter.verifyAccessToken(
      oldAccessToken,
      SETTINGS.AT_SECRET!
    );

    const verifiedOldAccessTokenPayloadUserId: string | undefined = verifiedOldAccessTokenPayload?.userId;

    const verifiedOldRefreshTokenPayload: { userId: string; deviceId: string } | null =
      await jwtAdapter.verifyRefreshToken(oldRefreshToken, SETTINGS.RT_SECRET!);

    const verifiedOldRefreshTokenPayloadUserId: string | undefined = verifiedOldRefreshTokenPayload?.userId;
    const verifiedOldRefreshTokenPayloadDeviceId: string | undefined = verifiedOldRefreshTokenPayload?.deviceId;

    const decodedOldAccessTokenPayload: { userId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeAccessToken(oldAccessToken);

    const decodedOldAccessTokenPayloadUserId: string | undefined = decodedOldAccessTokenPayload?.userId;
    const decodedOldAccessTokenPayloadIat: number | undefined = decodedOldAccessTokenPayload?.iat;
    const decodedOldAccessTokenPayloadExp: number | undefined = decodedOldAccessTokenPayload?.exp;
    const decodedOldAccessTokenPayloadIatDate: Date = new Date(decodedOldAccessTokenPayloadIat! * 1000);
    const decodedOldAccessTokenPayloadExpDate: Date = new Date(decodedOldAccessTokenPayloadExp! * 1000);

    const decodedOldRefreshTokenPayload: { userId: string; deviceId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeRefreshToken(oldRefreshToken);

    const decodedOldRefreshTokenPayloadUserId: string | undefined = decodedOldRefreshTokenPayload?.userId;
    const decodedOldRefreshTokenPayloadDeviceId: string | undefined = decodedOldRefreshTokenPayload?.deviceId;
    const decodedOldRefreshTokenPayloadIat: number | undefined = decodedOldRefreshTokenPayload?.iat;
    const decodedOldRefreshTokenPayloadExp: number | undefined = decodedOldRefreshTokenPayload?.exp;
    const decodedOldRefreshTokenPayloadIatDate: Date = new Date(decodedOldRefreshTokenPayloadIat! * 1000);
    const decodedOldRefreshTokenPayloadExpDate: Date = new Date(decodedOldRefreshTokenPayloadExp! * 1000);
    const olfSessions: SessionDBType[] | null = await authRepository.findAllSessionsByUserId(createdUserId);
    const oldSession = olfSessions![0];
    const oldSessionUserId: string = oldSession.userId;
    const oldSessionDeviceId: string = oldSession.deviceId;
    const oldSessionDeviceName: string = oldSession.deviceName;
    const oldSessionIp: string = oldSession.ip;
    const oldSessionIat: Date = oldSession.iat;
    const oldSessionExp: Date = oldSession.exp;

    const oldGetSecurityDeviceListResponse: SecurityDeviceListOutputDTO = await getSecurityDeviceList(
      app,
      testUserAgent,
      oldRefreshToken
    );

    const oldSecurityDevice: SecurityDeviceOutputDTO | undefined = oldGetSecurityDeviceListResponse[0];
    const oldSecurityDeviceId: string = oldSecurityDevice.deviceId;
    const oldSecurityDeviceTitle: string = oldSecurityDevice.title;
    const oldSecurityDeviceIp: string = oldSecurityDevice.ip;
    const oldSecurityDeviceLastActiveDate: Date = new Date(oldSecurityDevice.lastActiveDate);
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
    } = await refreshAccessAndRefreshTokens(app, testUserAgent, oldRefreshToken);

    const verifiedNewAccessTokenPayload: { userId: string } | null = await jwtAdapter.verifyAccessToken(
      newAccessToken,
      SETTINGS.AT_SECRET!
    );

    const verifiedNewAccessTokenPayloadUserId: string | undefined = verifiedNewAccessTokenPayload?.userId;

    const verifiedNewRefreshTokenPayload: { userId: string; deviceId: string } | null =
      await jwtAdapter.verifyRefreshToken(newRefreshToken, SETTINGS.RT_SECRET!);

    const verifiedNewRefreshTokenPayloadUserId: string | undefined = verifiedNewRefreshTokenPayload?.userId;
    const verifiedNewRefreshTokenPayloadDeviceId: string | undefined = verifiedNewRefreshTokenPayload?.deviceId;

    const decodedNewAccessTokenPayload: { userId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeAccessToken(newAccessToken);

    const decodedNewAccessTokenPayloadUserId: string | undefined = decodedNewAccessTokenPayload?.userId;
    const decodedNewAccessTokenPayloadIat: number | undefined = decodedNewAccessTokenPayload?.iat;
    const decodedNewAccessTokenPayloadExp: number | undefined = decodedNewAccessTokenPayload?.exp;
    const decodedNewAccessTokenPayloadIatDate: Date = new Date(decodedNewAccessTokenPayloadIat! * 1000);
    const decodedNewAccessTokenPayloadExpDate: Date = new Date(decodedNewAccessTokenPayloadExp! * 1000);

    const decodedNewRefreshTokenPayload: { userId: string; deviceId: string; iat: number; exp: number } | null =
      await jwtAdapter.decodeRefreshToken(newRefreshToken);

    const decodedNewRefreshTokenPayloadUserId: string | undefined = decodedNewRefreshTokenPayload?.userId;
    const decodedNewRefreshTokenPayloadDeviceId: string | undefined = decodedNewRefreshTokenPayload?.deviceId;
    const decodedNewRefreshTokenPayloadIat: number | undefined = decodedNewRefreshTokenPayload?.iat;
    const decodedNewRefreshTokenPayloadExp: number | undefined = decodedNewRefreshTokenPayload?.exp;
    const decodedNewRefreshTokenPayloadIatDate: Date = new Date(decodedNewRefreshTokenPayloadIat! * 1000);
    const decodedNewRefreshTokenPayloadExpDate: Date = new Date(decodedNewRefreshTokenPayloadExp! * 1000);
    const newSessions: SessionDBType[] | null = await authRepository.findAllSessionsByUserId(createdUserId);
    const updatedSession = newSessions![0];
    const updatedSessionUserId: string = updatedSession.userId;
    const updatedSessionDeviceId: string = updatedSession.deviceId;
    const updatedSessionDeviceName: string = updatedSession.deviceName;
    const updatedSessionIp: string = updatedSession.ip;
    const updatedSessionIat: Date = updatedSession.iat;
    const updatedSessionExp: Date = updatedSession.exp;

    const newGetSecurityDeviceListResponse: SecurityDeviceListOutputDTO = await getSecurityDeviceList(
      app,
      testUserAgent,
      newRefreshToken
    );

    const updatedSecurityDevice: SecurityDeviceOutputDTO | undefined = newGetSecurityDeviceListResponse[0];
    const updatedSecurityDeviceId: string = updatedSecurityDevice.deviceId;
    const updatedSecurityDeviceTitle: string = updatedSecurityDevice.title;
    const updatedSecurityDeviceIp: string = updatedSecurityDevice.ip;
    const updatedSecurityDeviceLastActiveDate: Date = new Date(updatedSecurityDevice.lastActiveDate);
    expect(typeof newAccessToken).toBe('string');
    expect(typeof newRefreshToken).toBe('string');
    expect(newAccessToken.length).toBeGreaterThan(3);
    expect(newRefreshToken.length).toBeGreaterThan(3);
    expect(hasHttpOnly).toBeTruthy();
    expect(hasSecure).toBeTruthy();
    expect(hasPath).toBeTruthy();
    expect(verifiedNewAccessTokenPayload).not.toBeNull();
    expect(verifiedNewAccessTokenPayload).not.toEqual(verifiedOldAccessTokenPayload);
    expect(verifiedNewAccessTokenPayload).not.toEqual(verifiedOldRefreshTokenPayload);
    expect(verifiedNewAccessTokenPayload).not.toEqual(verifiedNewRefreshTokenPayload);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(createdUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(verifiedOldAccessTokenPayloadUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(verifiedOldRefreshTokenPayloadUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(decodedOldAccessTokenPayloadUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(decodedOldRefreshTokenPayloadUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(oldSessionUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(verifiedNewRefreshTokenPayloadUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(decodedNewAccessTokenPayloadUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(decodedNewRefreshTokenPayloadUserId);
    expect(verifiedNewAccessTokenPayloadUserId).toBe(updatedSessionUserId);
    expect(verifiedNewRefreshTokenPayload).not.toBeNull();
    expect(verifiedNewRefreshTokenPayload).not.toEqual(verifiedOldAccessTokenPayload);
    expect(verifiedNewRefreshTokenPayload).not.toEqual(verifiedOldRefreshTokenPayload);
    expect(verifiedNewRefreshTokenPayloadDeviceId).toBe(verifiedOldRefreshTokenPayloadDeviceId);
    expect(verifiedNewRefreshTokenPayloadDeviceId).toBe(decodedOldRefreshTokenPayloadDeviceId);
    expect(verifiedNewRefreshTokenPayloadDeviceId).toBe(oldSessionDeviceId);
    expect(verifiedNewRefreshTokenPayloadDeviceId).toBe(oldSecurityDeviceId);
    expect(verifiedNewRefreshTokenPayloadDeviceId).toBe(decodedNewRefreshTokenPayloadDeviceId);
    expect(verifiedNewRefreshTokenPayloadDeviceId).toBe(updatedSessionDeviceId);
    expect(verifiedNewRefreshTokenPayloadDeviceId).toBe(updatedSecurityDeviceId);
    expect(decodedNewAccessTokenPayload).not.toBeNull();
    expect(decodedNewAccessTokenPayload).not.toEqual(decodedOldAccessTokenPayload);
    expect(decodedNewAccessTokenPayload).not.toEqual(decodedOldRefreshTokenPayload);
    expect(decodedNewAccessTokenPayload).not.toEqual(decodedNewRefreshTokenPayload);
    expect(decodedNewAccessTokenPayloadIatDate).not.toEqual(decodedOldAccessTokenPayloadIatDate);
    expect(decodedNewAccessTokenPayloadIatDate).not.toEqual(decodedOldRefreshTokenPayloadIatDate);
    expect(decodedNewAccessTokenPayloadIatDate).not.toEqual(oldSessionIat);
    expect(decodedNewAccessTokenPayloadIatDate).not.toEqual(oldSecurityDeviceLastActiveDate);
    expect(decodedNewAccessTokenPayloadIatDate).toEqual(decodedNewRefreshTokenPayloadIatDate);
    expect(decodedNewAccessTokenPayloadIatDate).toEqual(updatedSessionIat);
    expect(decodedNewAccessTokenPayloadIatDate).toEqual(updatedSecurityDeviceLastActiveDate);
    expect(decodedNewAccessTokenPayloadExpDate).not.toEqual(decodedOldAccessTokenPayloadExpDate);
    expect(decodedNewAccessTokenPayloadExpDate).not.toEqual(decodedOldRefreshTokenPayloadExpDate);
    expect(decodedNewAccessTokenPayloadExpDate).not.toEqual(oldSessionExp);
    expect(decodedNewAccessTokenPayloadExpDate).not.toEqual(decodedNewRefreshTokenPayloadExpDate);
    expect(decodedNewAccessTokenPayloadExpDate).not.toEqual(updatedSessionExp);
    expect(decodedNewRefreshTokenPayload).not.toBeNull();
    expect(decodedNewRefreshTokenPayload).not.toEqual(decodedOldAccessTokenPayload);
    expect(decodedNewRefreshTokenPayload).not.toEqual(decodedOldRefreshTokenPayload);
    expect(decodedNewRefreshTokenPayloadExpDate).not.toEqual(decodedOldAccessTokenPayloadExpDate);
    expect(decodedNewRefreshTokenPayloadExpDate).not.toEqual(decodedOldRefreshTokenPayloadExpDate);
    expect(decodedNewRefreshTokenPayloadExpDate).not.toEqual(oldSessionExp);
    expect(decodedNewRefreshTokenPayloadExpDate).toEqual(updatedSessionExp);
    expect(newSessions).toBeInstanceOf(Array);
    expect(newSessions!.length).toBe(1);
    expect(updatedSession).not.toBeNull();
    expect(updatedSessionDeviceName).toBe(testUserAgent);
    expect(updatedSessionDeviceName).toBe(oldSessionDeviceName);
    expect(updatedSessionDeviceName).toBe(oldSecurityDeviceTitle);
    expect(updatedSessionDeviceName).toBe(updatedSecurityDeviceTitle);
    expect(updatedSessionIp).toBe(oldSessionIp);
    expect(updatedSessionIp).toBe(oldSecurityDeviceIp);
    expect(updatedSessionIp).toBe(updatedSecurityDeviceIp);
    expect(newGetSecurityDeviceListResponse).toBeInstanceOf(Array);
    expect(newGetSecurityDeviceListResponse.length).toBe(1);
    expect(newGetSecurityDeviceListResponse).not.toBeUndefined();
  });

  it('✅ 004 should revoke a session when a correct refresh token passed; 007. POST /api/auth/logout', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserPassword: string = createUserData.password;
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };
    const testUserAgent: string = validUserAgents.userAgent_01;

    const { refreshToken }: { refreshToken: string } = await loginUserReturnAccessAndRefreshTokens(
      app,
      testUserAgent,
      loginUserData
    );

    await revokeSession(app, testUserAgent, refreshToken);

    const sessions: SessionDBType[] | null = await authRepository.findAllSessionsByUserId(createdUserId);
    expect(sessions).toBeNull();
  });

  it('✅ 005 should return user data when a correct access token passed; 002. GET /api/auth/me', async () => {
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createUserLogin: string = createUserData.login;
    const createUserEmail: string = createUserData.email;
    const createUserPassword: string = createUserData.password;
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const loginUserData: LoginDataInputDTO = { loginOrEmail: createUserLogin, password: createUserPassword };
    const accessToken: string = await loginUserReturnAccessToken(app, loginUserData);

    const authCreatedUserData: MeOutputDTO = await getAuthDataByAccessToken(
      app,
      validUserAgents.userAgent_01,
      accessToken
    );

    expect(authCreatedUserData).toEqual({
      login: createUserLogin,
      email: createUserEmail,
      userId: createdUser.id,
    });
  });
});
