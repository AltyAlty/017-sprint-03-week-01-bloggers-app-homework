import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { UpdatePostByIdInputDTO } from '../../../src/posts/routes/input-dto/update-post-by-id.input-dto';
import { getUpdatePostInputDTO } from './input-dto-utils/get-update-post-input-dto.test-util';

export const updatePostById = async (
  app: Express,
  postId: string | any,
  blogId: string,
  postDTO?: UpdatePostByIdInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<any> => {
  const testUpdatePostData: UpdatePostByIdInputDTO = { ...getUpdatePostInputDTO(blogId), ...postDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  const testBasicAuthToken: string = basicAuthToken ?? generateBasicAuthToken();

  const updatePostByIdResponse = await request(app)
    .put(`${SETTINGS.POSTS_PATH}/${postId}`)
    .set('Authorization', testBasicAuthToken)
    .send(testUpdatePostData)
    .expect(testStatus);

  return updatePostByIdResponse.body;
};
