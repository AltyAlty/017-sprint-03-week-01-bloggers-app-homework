import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const deletePostById = async (
  app: Express,
  postId: string | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  const testBasicAuthToken: string = basicAuthToken ?? generateBasicAuthToken();

  const deletePostByIdResponse = await request(app)
    .delete(`${SETTINGS.POSTS_PATH}/${postId}`)
    .set('Authorization', testBasicAuthToken)
    .expect(testStatus);

  return deletePostByIdResponse.body;
};
