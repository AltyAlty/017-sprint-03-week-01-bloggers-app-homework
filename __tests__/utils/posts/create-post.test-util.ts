import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { getCreatePostInputDTO } from './get-create-post-input-dto.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';
import { CreatePostInputDTO } from '../../../src/posts/routes/input-dto/create-post.input-dto';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { createBlog } from '../blogs/create-blog.test-util';

export const createPost = async (
  app: Express,
  postDTO?: CreatePostInputDTO | any,
  blogId?: string | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<PostOutputDTO> => {
  const newBlog = blogId ? null : await createBlog(app);
  const testBlogId = newBlog ? newBlog.id : blogId;
  const testCreatePostData = { ...getCreatePostInputDTO(testBlogId!), ...postDTO };
  const testStatus = expectedStatus ?? HttpStatuses.Created_201;
  const testBasicAuthToken = basicAuthToken ?? generateBasicAuthToken();

  const createPostResponse = await request(app)
    .post(`${SETTINGS.POSTS_PATH}${SETTINGS.CREATE_POST_PATH}`)
    .set('Authorization', testBasicAuthToken)
    .send(testCreatePostData)
    .expect(testStatus);

  return createPostResponse.body;
};
