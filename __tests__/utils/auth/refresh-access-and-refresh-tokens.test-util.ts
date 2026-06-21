import { Express } from 'express';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';

export const refreshAccessAndRefreshTokens = async (
  app: Express,
  refreshTokenCookieString?: string | any,
  refreshToken?: string | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testRefreshTokenCookieString =
    refreshTokenCookieString ?? `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`;

  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;

  const refreshAccessAndRefreshTokensResponse = await request(app)
    .post(`${SETTINGS.AUTH_PATH}${SETTINGS.REFRESH_TOKEN_PATH}`)
    .set('Cookie', testRefreshTokenCookieString)
    .expect(testStatus);

  const newAccessToken = refreshAccessAndRefreshTokensResponse.body.accessToken;

  const newRefreshToken = (
    refreshAccessAndRefreshTokensResponse.headers['set-cookie'] as unknown as string[] | undefined
  )
    ?.find(cookie => cookie.startsWith('refreshToken='))
    ?.split(';')[0]
    ?.split('=')[1];

  const newRefreshTokenCookieString = (
    refreshAccessAndRefreshTokensResponse.headers['set-cookie'] as unknown as string[] | undefined
  )?.find(cookie => cookie.startsWith('refreshToken='));

  const hasHttpOnly = newRefreshTokenCookieString?.includes('HttpOnly');
  const hasSecure = newRefreshTokenCookieString?.includes('Secure');
  const hasPath = newRefreshTokenCookieString?.includes('Path=/');

  return {
    newAccessToken,
    newRefreshToken,
    hasHttpOnly,
    hasSecure,
    hasPath,
    newRefreshTokenCookieString,
    refreshAccessAndRefreshTokensResponse,
  };
};
