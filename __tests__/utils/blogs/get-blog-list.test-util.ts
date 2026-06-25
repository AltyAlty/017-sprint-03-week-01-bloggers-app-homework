import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { PaginatedBlogListOutputDTO } from '../../../src/blogs/routes/output-dto/paginated-blog-list.output-dto';

export const getBlogList = async (
  app: Express,
  urlWithPagination?: string,
  expectedStatus?: HttpStatuses
): Promise<PaginatedBlogListOutputDTO> => {
  const url = urlWithPagination ?? `${SETTINGS.BLOGS_PATH}${SETTINGS.GET_BLOG_LIST_PATH}`;
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;
  const getBlogListResponse = await request(app).get(url).expect(testStatus);
  return getBlogListResponse.body;
};
