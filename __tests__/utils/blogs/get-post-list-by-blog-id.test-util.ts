import { Express } from 'express';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { PaginatedPostListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-post-list.output-dto';

export const getPostListByBlogId = async (
  app: Express,
  blogId: any,
  urlWithPagination?: string,
  expectedStatus?: HttpStatuses
): Promise<PaginatedPostListOutputDTO> => {
  const url: string = urlWithPagination ?? `${SETTINGS.BLOGS_PATH}/${blogId}/posts`;
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  const getPostListByBlogIdResponse = await request(app).get(url).expect(testStatus);
  return getPostListByBlogIdResponse.body;
};
