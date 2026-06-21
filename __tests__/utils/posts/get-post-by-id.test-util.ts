import request from 'supertest';
import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';

export const getPostById = async (
  app: Express,
  postId: string | any,
  expectedStatus?: HttpStatuses
): Promise<PostOutputDTO> => {
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;
  const getPostByIdResponse = await request(app).get(`${SETTINGS.POSTS_PATH}/${postId}`).expect(testStatus);
  return getPostByIdResponse.body;
};
