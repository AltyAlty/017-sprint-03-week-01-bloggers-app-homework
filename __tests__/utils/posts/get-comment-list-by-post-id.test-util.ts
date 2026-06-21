import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';
import { PaginatedCommentListOutputDTO } from '../../../src/comments/routes/output-dto/paginated-comment-list.output-dto';

export const getCommentListByPostId = async (
  app: Express,
  postId: any,
  urlWithPagination?: string,
  expectedStatus?: HttpStatuses
): Promise<PaginatedCommentListOutputDTO> => {
  const url = urlWithPagination ?? `${SETTINGS.POSTS_PATH}/${postId}/comments`;
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;
  const getCommentListByPostIdResponse = await request(app).get(url).expect(testStatus);
  return getCommentListByPostIdResponse.body;
};
