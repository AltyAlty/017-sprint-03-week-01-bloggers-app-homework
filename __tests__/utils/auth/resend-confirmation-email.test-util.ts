import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const resendConfirmationEmail = async (
  app: Express,
  email: string | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;

  const resendConfirmationEmailResponse = await request(app)
    .post(`${SETTINGS.AUTH_PATH}${SETTINGS.RESEND_CONFIRMATION_EMAIL_PATH}`)
    .send({ email })
    .expect(testStatus);

  return resendConfirmationEmailResponse.body;
};
