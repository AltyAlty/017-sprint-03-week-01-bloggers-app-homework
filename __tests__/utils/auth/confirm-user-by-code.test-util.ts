import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const confirmUserByCode = async (
  app: Express,
  userAgent: string | any,
  code: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let confirmUserByCodeResponse;

  if (noUserAgent) {
    confirmUserByCodeResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.CONFIRM_USER_BY_CODE_PATH}`)
      .send({ code })
      .expect(testStatus);
  } else {
    confirmUserByCodeResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.CONFIRM_USER_BY_CODE_PATH}`)
      .set('User-Agent', userAgent)
      .send({ code })
      .expect(testStatus);
  }

  return confirmUserByCodeResponse.body;
};
