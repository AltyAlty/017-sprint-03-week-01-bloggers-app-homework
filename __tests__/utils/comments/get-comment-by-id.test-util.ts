import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export const getCommentById = async (
  app: Express,
  commentId: string | any,
  expectedStatus?: HttpStatuses
): Promise<CommentOutputDTO> => {
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;
  const getCommentByIdResponse = await request(app).get(`${SETTINGS.COMMENTS_PATH}/${commentId}`).expect(testStatus);
  return getCommentByIdResponse.body;
};
