import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { CreatePostForBlogByBlogIdInputDTO } from '../../../src/posts/routes/input-dto/create-post-for-blog-by-blog-id.input-dto';
import { getCreatePostForBlogInputDTO } from './input-dto-utils/get-create-post-for-blog-input-dto.test-util';

export const createPostForBlog = async (
  app: Express,
  blogId: string | any,
  postDTO?: CreatePostForBlogByBlogIdInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<PostOutputDTO> => {
  const testCreatePostData: CreatePostForBlogByBlogIdInputDTO = { ...getCreatePostForBlogInputDTO(), ...postDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Created_201;
  const testBasicAuthToken: string = basicAuthToken ?? generateBasicAuthToken();

  const createPostInBlogResponse = await request(app)
    .post(`${SETTINGS.BLOGS_PATH}/${blogId}/posts`)
    .set('Authorization', testBasicAuthToken)
    .send(testCreatePostData)
    .expect(testStatus);

  return createPostInBlogResponse.body;
};
