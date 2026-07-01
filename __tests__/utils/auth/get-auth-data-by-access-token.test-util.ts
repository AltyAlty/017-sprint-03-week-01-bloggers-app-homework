import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { MeOutputDTO } from '../../../src/auth/routes/output-dto/me.output-dto';

export const getAuthDataByAccessToken = async (
  app: Express,
  userAgent: string | any,
  accessToken: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean
): Promise<MeOutputDTO> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  let getAuthDataByAccessTokenResponse;

  if (noUserAgent) {
    getAuthDataByAccessTokenResponse = await request(app)
      .get(`${SETTINGS.AUTH_PATH}${SETTINGS.GET_AUTH_DATA_BY_TOKEN_PATH}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(testStatus);
  } else {
    getAuthDataByAccessTokenResponse = await request(app)
      .get(`${SETTINGS.AUTH_PATH}${SETTINGS.GET_AUTH_DATA_BY_TOKEN_PATH}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .set('User-Agent', userAgent)
      .expect(testStatus);
  }

  return getAuthDataByAccessTokenResponse.body;
};
