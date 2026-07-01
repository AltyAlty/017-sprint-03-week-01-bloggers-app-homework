import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const resendConfirmationEmail = async (
  app: Express,
  userAgent: string | any,
  email: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let resendConfirmationEmailResponse;

  if (noUserAgent) {
    resendConfirmationEmailResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.RESEND_CONFIRMATION_EMAIL_PATH}`)
      .send({ email })
      .expect(testStatus);
  } else {
    resendConfirmationEmailResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.RESEND_CONFIRMATION_EMAIL_PATH}`)
      .set('User-Agent', userAgent)
      .send({ email })
      .expect(testStatus);
  }

  return resendConfirmationEmailResponse.body;
};
