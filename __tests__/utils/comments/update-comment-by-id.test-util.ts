import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { getUpdateCommentInputDTO } from './get-update-comment-input-dto.test-util';
import { UpdateCommentInputDTO } from '../../../src/comments/routes/input-dto/update-comment.input-dto';

export const updateCommentById = async (
  app: Express,
  commentId: string | any,
  accessToken: string | any,
  commentDTO?: UpdateCommentInputDTO | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testUpdateCommentData: UpdateCommentInputDTO = { ...getUpdateCommentInputDTO(), ...commentDTO };
  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;

  const updateCommentByIdResponse = await request(app)
    .put(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(testUpdateCommentData)
    .expect(testStatus);

  return updateCommentByIdResponse.body;
};
