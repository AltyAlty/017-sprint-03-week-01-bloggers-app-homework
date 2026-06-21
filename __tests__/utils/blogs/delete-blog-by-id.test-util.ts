import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export const deleteBlogById = async (
  app: Express,
  blogId: string | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<any> => {
  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;
  const testBasicAuthToken = basicAuthToken ?? generateBasicAuthToken();

  const deleteBlogByIdresponse = await request(app)
    .delete(`${SETTINGS.BLOGS_PATH}/${blogId}`)
    .set('Authorization', testBasicAuthToken)
    .expect(testStatus);

  return deleteBlogByIdresponse.body;
};
