import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { getUpdateCommentInputDTO } from './input-dto-utils/get-update-comment-input-dto.test-util';
import { UpdateCommentByIdInputDTO } from '../../../src/comments/routes/input-dto/update-comment-by-id.input-dto';
import { validUserAgents } from '../../test-data/auth.test-data';

export const updateCommentById = async (
  app: Express,
  commentId: string | any,
  accessToken: string | any,
  commentDTO?: UpdateCommentByIdInputDTO | any,
  expectedStatus?: HttpStatuses
): Promise<any> => {
  const testUpdateCommentData: UpdateCommentByIdInputDTO = { ...getUpdateCommentInputDTO(), ...commentDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;

  const updateCommentByIdResponse = await request(app)
    .put(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
    .set('User-Agent', validUserAgents.userAgent_01)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(testUpdateCommentData)
    .expect(testStatus);

  return updateCommentByIdResponse.body;
};
