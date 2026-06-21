import { Express } from 'express';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';

export const revokeRefreshToken = async (
  app: Express,
  refreshTokenCookieString?: string | any,
  refreshToken?: string | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testRefreshTokenCookieString =
    refreshTokenCookieString ?? `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`;

  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;

  const revokeRefreshTokenResponse = await request(app)
    .post(`${SETTINGS.AUTH_PATH}${SETTINGS.LOGOUT_PATH}`)
    .set('Cookie', testRefreshTokenCookieString)
    .expect(testStatus);

  return revokeRefreshTokenResponse.body;
};
