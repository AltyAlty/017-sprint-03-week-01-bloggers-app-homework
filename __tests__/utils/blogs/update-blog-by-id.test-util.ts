import request from 'supertest';
import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';
import { getUpdateBlogInputDTO } from './get-update-blog-input-dto.test-util';
import { UpdateBlogInputDTO } from '../../../src/blogs/routes/input-dto/update-blog.input-dto';

export const updateBlogById = async (
  app: Express,
  blogId: string | any,
  blogDTO?: UpdateBlogInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<any> => {
  const testUpdateBlogData: UpdateBlogInputDTO = { ...getUpdateBlogInputDTO(), ...blogDTO };
  const testStatus = expectedStatus ?? HttpStatuses.NoContent_204;
  const testBasicAuthToken = basicAuthToken ?? generateBasicAuthToken();

  const updateBlogByIdResponse = await request(app)
    .put(`${SETTINGS.BLOGS_PATH}/${blogId}`)
    .set('Authorization', testBasicAuthToken)
    .send(testUpdateBlogData)
    .expect(testStatus);

  return updateBlogByIdResponse.body;
};
