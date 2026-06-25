import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { getCreatePostInBlogInputDTO } from './get-create-post-in-blog-input-dto.test-util';
import { CreatePostForBlogByBlogIdInputDTO } from '../../../src/posts/routes/input-dto/create-post-for-blog-by-blog-id.input-dto';

export const createPostInBlog = async (
  app: Express,
  blogId: string | any,
  postDTO?: CreatePostForBlogByBlogIdInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<PostOutputDTO> => {
  const testCreatePostData = { ...getCreatePostInBlogInputDTO(), ...postDTO };
  const testStatus = expectedStatus ?? HttpStatuses.Created_201;
  const testBasicAuthToken = basicAuthToken ?? generateBasicAuthToken();

  const createPostInBlogResponse = await request(app)
    .post(`${SETTINGS.BLOGS_PATH}/${blogId}/posts`)
    .set('Authorization', testBasicAuthToken)
    .send(testCreatePostData)
    .expect(testStatus);

  return createPostInBlogResponse.body;
};
