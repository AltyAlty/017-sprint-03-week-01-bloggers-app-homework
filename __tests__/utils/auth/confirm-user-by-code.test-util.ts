import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const confirmUserByCode = async (
  app: Express,
  code: string | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;

  const confirmUserByCodeResponse = await request(app)
    .post(`${SETTINGS.AUTH_PATH}${SETTINGS.CONFIRM_USER_BY_CODE_PATH}`)
    .send({ code })
    .expect(testStatus);

  return confirmUserByCodeResponse.body;
};
