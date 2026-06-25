import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { PaginatedPostListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-post-list.output-dto';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';

export const getPostList = async (
  app: Express,
  urlWithPagination?: string,
  expectedStatus?: HttpStatuses
): Promise<PaginatedPostListOutputDTO> => {
  const url = urlWithPagination ?? `${SETTINGS.POSTS_PATH}${SETTINGS.GET_POST_LIST_PATH}`;
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;
  const getPostListResponse = await request(app).get(url).expect(testStatus);
  return getPostListResponse.body;
};
