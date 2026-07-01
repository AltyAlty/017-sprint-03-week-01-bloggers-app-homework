import { CreateCommentForPostInputDTO } from '../../../src/comments/routes/input-dto/create-comment-for-post.input-dto';
import { Express } from 'express';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { getCreateCommentForPostInputDTO } from '../comments/input-dto-utils/get-create-comment-for-post-input-dto.test-util';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { validUserAgents } from '../../test-data/auth.test-data';

export const createCommentForPost = async (
  app: Express,
  postId: string | any,
  accessToken: string | any,
  commentDTO?: CreateCommentForPostInputDTO | any,
  expectedStatus?: HttpStatuses
): Promise<CommentOutputDTO> => {
  const testCreateCommentData: CreateCommentForPostInputDTO = { ...getCreateCommentForPostInputDTO(), ...commentDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Created_201;

  const createCommentInPostResponse = await request(app)
    .post(`${SETTINGS.POSTS_PATH}/${postId}/comments`)
    .set('User-Agent', validUserAgents.userAgent_01)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(testCreateCommentData)
    .expect(testStatus);

  return createCommentInPostResponse.body;
};
