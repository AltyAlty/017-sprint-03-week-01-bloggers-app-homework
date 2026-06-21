import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { UpdatePostInputDTO } from '../../../src/posts/routes/input-dto/update-post.input-dto';
import { getUpdatePostInputDTO } from './get-update-post-input-dto.test-util';

export const updatePostById = async (
  app: Express,
  postId: string | any,
  blogId: string,
  postDTO?: UpdatePostInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<any> => {
  const testUpdatePostData: UpdatePostInputDTO = { ...getUpdatePostInputDTO(blogId), ...postDTO };
  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;
  const testBasicAuthToken = basicAuthToken ?? generateBasicAuthToken();

  const updatePostByIdResponse = await request(app)
    .put(`${SETTINGS.POSTS_PATH}/${postId}`)
    .set('Authorization', testBasicAuthToken)
    .send(testUpdatePostData)
    .expect(testStatus);

  return updatePostByIdResponse.body;
};
