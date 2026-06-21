import { LoginDataInputDTO } from '../../../src/auth/routes/input-dto/login-data.input-dto';
import { Express } from 'express';
import { getLoginDataInputDTO } from './get-login-data-input-dto.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';

export const loginUserReturnAccessAndRefreshTokens = async (
  app: Express,
  loginDataDTO?: LoginDataInputDTO | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testLoginData: LoginDataInputDTO = { ...getLoginDataInputDTO(), ...loginDataDTO };
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;

  const loginUserResponse = await request(app)
    .post(`${SETTINGS.AUTH_PATH}${SETTINGS.AUTH_BY_LOGIN_OR_EMAIL_PATH}`)
    .send(testLoginData)
    .expect(testStatus);

  const accessToken = loginUserResponse.body.accessToken;

  /* Шаги получения RT:
  1. ["cookie1=value1; Path=/" , "refreshToken=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Path=/", "cookie3=value3; Path=/"]
  2. "refreshToken=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Path=/"
  3. "refreshToken=eyJhbGciOiJIUzI1NiIs..."
  4. "eyJhbGciOiJIUzI1NiIs..."*/
  const refreshToken = (loginUserResponse.headers['set-cookie'] as unknown as string[] | undefined)
    ?.find(cookie => cookie.startsWith('refreshToken='))
    ?.split(';')[0]
    ?.split('=')[1];

  const refreshTokenCookieString = (loginUserResponse.headers['set-cookie'] as unknown as string[] | undefined)?.find(
    cookie => cookie.startsWith('refreshToken=')
  );

  const hasHttpOnly = refreshTokenCookieString?.includes('HttpOnly');
  const hasSecure = refreshTokenCookieString?.includes('Secure');
  const hasPath = refreshTokenCookieString?.includes('Path=/');

  return { accessToken, refreshToken, hasHttpOnly, hasSecure, hasPath, refreshTokenCookieString, loginUserResponse };
};
