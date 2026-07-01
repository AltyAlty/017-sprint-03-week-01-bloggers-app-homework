import request from 'supertest';
import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';
import { UpdateBlogByIdInputDTO } from '../../../src/blogs/routes/input-dto/update-blog-by-id.input-dto';
import { getUpdateBlogInputDTO } from './input-dto-utils/get-update-blog-input-dto.test-util';

export const updateBlogById = async (
  app: Express,
  blogId: string | any,
  blogDTO?: UpdateBlogByIdInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<any> => {
  const testUpdateBlogData: UpdateBlogByIdInputDTO = { ...getUpdateBlogInputDTO(), ...blogDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  const testBasicAuthToken: string = basicAuthToken ?? generateBasicAuthToken();

  const updateBlogByIdResponse = await request(app)
    .put(`${SETTINGS.BLOGS_PATH}/${blogId}`)
    .set('Authorization', testBasicAuthToken)
    .send(testUpdateBlogData)
    .expect(testStatus);

  return updateBlogByIdResponse.body;
};
