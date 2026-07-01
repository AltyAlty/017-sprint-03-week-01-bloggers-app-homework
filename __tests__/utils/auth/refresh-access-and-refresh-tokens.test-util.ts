import { Express } from 'express';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';

export const refreshAccessAndRefreshTokens = async (
  app: Express,
  userAgent: string | any,
  refreshToken?: string | any,
  refreshTokenCookieString?: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean
): Promise<any> => {
  const testRefreshTokenCookieString: string =
    refreshTokenCookieString ?? `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`;

  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  let refreshAccessAndRefreshTokensResponse;

  if (noUserAgent) {
    refreshAccessAndRefreshTokensResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.REFRESH_TOKEN_PATH}`)
      .set('Cookie', testRefreshTokenCookieString)

      .expect(testStatus);
  } else {
    refreshAccessAndRefreshTokensResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.REFRESH_TOKEN_PATH}`)
      .set('Cookie', testRefreshTokenCookieString)
      .set('User-Agent', userAgent)
      .expect(testStatus);
  }

  const newAccessToken: string = refreshAccessAndRefreshTokensResponse.body.accessToken;

  const newRefreshToken: string | undefined = (
    refreshAccessAndRefreshTokensResponse.headers['set-cookie'] as unknown as string[] | undefined
  )
    ?.find(cookie => cookie.startsWith('refreshToken='))
    ?.split(';')[0]
    ?.split('=')[1];

  const newRefreshTokenCookieString: string | undefined = (
    refreshAccessAndRefreshTokensResponse.headers['set-cookie'] as unknown as string[] | undefined
  )?.find(cookie => cookie.startsWith('refreshToken='));

  const hasHttpOnly: boolean | undefined = newRefreshTokenCookieString?.includes('HttpOnly');
  const hasSecure: boolean | undefined = newRefreshTokenCookieString?.includes('Secure');
  const hasPath: boolean | undefined = newRefreshTokenCookieString?.includes('Path=/');

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
