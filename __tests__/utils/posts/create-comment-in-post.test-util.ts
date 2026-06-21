import { CreateCommentInPostInputDTO } from '../../../src/comments/routes/input-dto/create-comment-in-post.input-dto';
import { Express } from 'express';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { getCreateCommentInPostInputDTO } from '../comments/get-create-comment-in-post-input-dto.test-util';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export const createCommentInPost = async (
  app: Express,
  postId: string | any,
  accessToken: string | any,
  commentDTO?: CreateCommentInPostInputDTO | any,
  expectedStatus?: HttpStatuses
): Promise<CommentOutputDTO> => {
  const testCreateCommentData: CreateCommentInPostInputDTO = { ...getCreateCommentInPostInputDTO(), ...commentDTO };
  const testStatus = expectedStatus ?? HttpStatuses.Created_201;

  const createCommentInPostResponse = await request(app)
    .post(`${SETTINGS.POSTS_PATH}/${postId}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(testCreateCommentData)
    .expect(testStatus);

  return createCommentInPostResponse.body;
};
