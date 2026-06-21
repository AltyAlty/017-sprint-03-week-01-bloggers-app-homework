import request from 'supertest';
import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';

export const getBlogById = async (
  app: Express,
  blogId: string | any,
  expectedStatus?: HttpStatuses
): Promise<BlogOutputDTO> => {
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;
  const getBlogByIdResponse = await request(app).get(`${SETTINGS.BLOGS_PATH}/${blogId}`).expect(testStatus);
  return getBlogByIdResponse.body;
};
