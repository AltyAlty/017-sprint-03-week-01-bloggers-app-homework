import request from 'supertest';
import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';
import { CreateBlogInputDTO } from '../../../src/blogs/routes/input-dto/create-blog.input-dto';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';
import { getCreateBlogInputDTO } from './input-dto-utils/get-create-blog-input-dto.test-util';

export const createBlog = async (
  app: Express,
  blogDTO?: CreateBlogInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<BlogOutputDTO> => {
  const testCreateBlogData: CreateBlogInputDTO = { ...getCreateBlogInputDTO(), ...blogDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Created_201;
  const testBasicAuthToken: string = basicAuthToken ?? generateBasicAuthToken();

  const createBlogResponse = await request(app)
    .post(`${SETTINGS.BLOGS_PATH}${SETTINGS.CREATE_BLOG_PATH}`)
    .set('Authorization', testBasicAuthToken)
    .send(testCreateBlogData)
    .expect(testStatus);

  return createBlogResponse.body;
};
