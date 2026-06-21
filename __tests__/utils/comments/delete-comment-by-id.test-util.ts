import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const deleteCommentById = async (
  app: Express,
  commentId: string | any,
  accessToken: string | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;

  const deleteCommentByIdResponse = await request(app)
    .delete(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(testStatus);

  return deleteCommentByIdResponse.body;
};
