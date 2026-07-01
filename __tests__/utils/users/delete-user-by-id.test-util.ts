import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';

export const deleteUserById = async (
  app: Express,
  userId: string | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  const testBasicAuthToken: string = basicAuthToken ?? generateBasicAuthToken();

  const deleteUserByIdResponse = await request(app)
    .delete(`${SETTINGS.USERS_PATH}/${userId}`)
    .set('Authorization', testBasicAuthToken)
    .expect(testStatus);

  return deleteUserByIdResponse.body;
};
