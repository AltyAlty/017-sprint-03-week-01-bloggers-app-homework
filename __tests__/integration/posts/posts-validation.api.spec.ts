import 'dotenv/config';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import { createBlog } from '../../utils/blogs/create-blog.test-util';
import { createPost } from '../../utils/posts/create-post.test-util';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { getPostById } from '../../utils/posts/get-post-by-id.test-util';
import { createUser } from '../../utils/users/create-user.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { createCommentInPost } from '../../utils/posts/create-comment-in-post.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { getPostList } from '../../utils/posts/get-post-list.test-util';
import { PaginatedPostListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-post-list.output-dto';
import { updatePostById } from '../../utils/posts/update-post-by-id.test-util';
import { deletePostById } from '../../utils/posts/delete-post-by-id.test-util';
import { getCommentListByPostId } from '../../utils/posts/get-comment-list-by-post-id.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto.test-util';
import { PaginatedCommentListOutputDTO } from '../../../src/comments/routes/output-dto/paginated-comment-list.output-dto';
import { invalidAccessTokens } from '../../test-data/auth.test-data';
import { invalidBlogIds } from '../../test-data/blogs.test-data';
import {
  invalidPostContents,
  invalidPostIds,
  invalidPostShortDescriptions,
  invalidPostsPaginationSettings,
  invalidPostTitles,
  validPostsPaginationSettings,
} from '../../test-data/posts.test-data';
import {
  invalidCommentContents,
  invalidCommentsPaginationSettings,
  validCommentsPaginationSettings,
} from '../../test-data/comments.test-data';

describe('Posts API validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not create a post without proper basic authorization; POST /api/posts', async () => {
    await createPost(app, undefined, undefined, HttpStatuses.Unauthorized_401, 'token');

    const getPostListResponse: PaginatedPostListOutputDTO = await getPostList(app);
    expect(getPostListResponse.items).toBeInstanceOf(Array);
    expect(getPostListResponse.items.length).toBe(0);
    expect(getPostListResponse.totalCount).toBe(0);
  });

  it('❌ 002 should not create a post when an invalid body passed; POST /api/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createPostResponse_01: any = await createPost(
      app,
      { title: invalidPostTitles.title_01 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_02: any = await createPost(
      app,
      { title: invalidPostTitles.title_02 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_03: any = await createPost(
      app,
      { title: invalidPostTitles.title_03 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_04: any = await createPost(
      app,
      { title: invalidPostTitles.title_04 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_05: any = await createPost(
      app,
      { title: invalidPostTitles.title_05 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_06: any = await createPost(
      app,
      { shortDescription: invalidPostShortDescriptions.shortDescription_01 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_07: any = await createPost(
      app,
      { shortDescription: invalidPostShortDescriptions.shortDescription_02 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_08: any = await createPost(
      app,
      { shortDescription: invalidPostShortDescriptions.shortDescription_03 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_09: any = await createPost(
      app,
      { content: invalidPostContents.content_01 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_10: any = await createPost(
      app,
      { content: invalidPostContents.content_02 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_11: any = await createPost(
      app,
      { content: invalidPostContents.content_03 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_12: any = await createPost(
      app,
      { blogId: invalidBlogIds.id_01 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_13: any = await createPost(
      app,
      { blogId: invalidBlogIds.id_02 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_14: any = await createPost(
      app,
      { blogId: invalidBlogIds.id_03 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_15: any = await createPost(
      app,
      { blogId: invalidBlogIds.id_04 },
      createdBlogId,
      testStatus
    );

    const getPostListResponse: PaginatedPostListOutputDTO = await getPostList(app);
    expect(getPostListResponse.items).toBeInstanceOf(Array);
    expect(getPostListResponse.items.length).toBe(0);
    expect(getPostListResponse.totalCount).toBe(0);
    expect(createPostResponse_01.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_01.errorsMessages[0].message).toBe('Field "title" must not be empty');
    expect(createPostResponse_02.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_03.errorsMessages[0].message).toBe('Field "title" must be between 1 and 30 characters');
    expect(createPostResponse_03.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_03.errorsMessages[0].message).toBe('Field "title" must be between 1 and 30 characters');
    expect(createPostResponse_04.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_04.errorsMessages[0].message).toBe('Field "title" must be between 1 and 30 characters');
    expect(createPostResponse_05.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_05.errorsMessages[0].message).toBe('Field "title" must be a string');
    expect(createPostResponse_06.errorsMessages[0].field).toBe('shortDescription');
    expect(createPostResponse_06.errorsMessages[0].message).toBe('Field "shortDescription" must not be empty');
    expect(createPostResponse_07.errorsMessages[0].field).toBe('shortDescription');
    expect(createPostResponse_07.errorsMessages[0].message).toBe('Field "shortDescription" must not be empty');
    expect(createPostResponse_08.errorsMessages[0].field).toBe('shortDescription');
    expect(createPostResponse_08.errorsMessages[0].message).toBe('Field "shortDescription" must be a string');
    expect(createPostResponse_09.errorsMessages[0].field).toBe('content');
    expect(createPostResponse_09.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(createPostResponse_10.errorsMessages[0].field).toBe('content');
    expect(createPostResponse_10.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(createPostResponse_11.errorsMessages[0].field).toBe('content');
    expect(createPostResponse_11.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createPostResponse_12.errorsMessages[0].field).toBe('blogId');
    expect(createPostResponse_12.errorsMessages[0].message).toBe('Field "blogId" must be an ObjectId');
    expect(createPostResponse_13.errorsMessages[0].field).toBe('blogId');
    expect(createPostResponse_13.errorsMessages[0].message).toBe('Field "blogId" must be a string');
    expect(createPostResponse_14.errorsMessages[0].field).toBe('blogId');
    expect(createPostResponse_14.errorsMessages[0].message).toBe('Field "blogId" must be a string');
    expect(createPostResponse_15.errorsMessages[0].field).toBe('blogId');
    expect(createPostResponse_15.errorsMessages[0].message).toBe('Field "blogId" must not be empty');
  });

  it('❌ 003 should not return a post by invalid ID; GET /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getPostByIdResponse_01: any = await getPostById(app, invalidPostIds.id_01, testStatus);
    const getPostByIdResponse_02: any = await getPostById(app, invalidPostIds.id_02, testStatus);
    const getPostByIdResponse_03: any = await getPostById(app, invalidPostIds.id_03, testStatus);

    const getPostByIdResponse_04: PostOutputDTO = await getPostById(app, createdPostId);
    expect(getPostByIdResponse_04).toEqual(createdPost);
    expect(getPostByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(getPostByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(getPostByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(getPostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(getPostByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(getPostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 004 should not return a list of posts when invalid pagination settings passed; GET /api/posts', async () => {
    const validUrl: string = `${SETTINGS.POSTS_PATH}?pageSize=${validPostsPaginationSettings.pageSize}&pageNumber=${validPostsPaginationSettings.pageNumber}&sortDirection=${validPostsPaginationSettings.sortDirection}&sortBy=${validPostsPaginationSettings.sortBy}`;
    const invalidUrl_01: string = `${SETTINGS.POSTS_PATH}?pageSize=${invalidPostsPaginationSettings.pageSize}&pageNumber=${validPostsPaginationSettings.pageNumber}&sortDirection=${validPostsPaginationSettings.sortDirection}&sortBy=${validPostsPaginationSettings.sortBy}`;
    const invalidUrl_02: string = `${SETTINGS.POSTS_PATH}?pageSize=${validPostsPaginationSettings.pageSize}&pageNumber=${invalidPostsPaginationSettings.pageNumber}&sortDirection=${validPostsPaginationSettings.sortDirection}&sortBy=${validPostsPaginationSettings.sortBy}`;
    const invalidUrl_03: string = `${SETTINGS.POSTS_PATH}?pageSize=${validPostsPaginationSettings.pageSize}&pageNumber=${validPostsPaginationSettings.pageNumber}&sortDirection=${invalidPostsPaginationSettings.sortDirection}&sortBy=${validPostsPaginationSettings.sortBy}`;
    const invalidUrl_04: string = `${SETTINGS.POSTS_PATH}?pageSize=${validPostsPaginationSettings.pageSize}&pageNumber=${validPostsPaginationSettings.pageNumber}&sortDirection=${validPostsPaginationSettings.sortDirection}&sortBy=${invalidPostsPaginationSettings.sortDirection}`;
    await Promise.all([createPost(app), createPost(app)]);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getPostListResponse_01: any = await getPostList(app, invalidUrl_01, testStatus);
    const getPostListResponse_02: any = await getPostList(app, invalidUrl_02, testStatus);
    const getPostListResponse_03: any = await getPostList(app, invalidUrl_03, testStatus);
    const getPostListResponse_04: any = await getPostList(app, invalidUrl_04, testStatus);

    const getPostListResponse_05: PaginatedPostListOutputDTO = await getPostList(app, validUrl);
    expect(getPostListResponse_05.items).toBeInstanceOf(Array);
    expect(getPostListResponse_05.items.length).toBe(2);
    expect(getPostListResponse_05.totalCount).toBe(2);
    expect(getPostListResponse_01.errorsMessages[0].field).toBe('pageSize');

    expect(getPostListResponse_01.errorsMessages[0].message).toBe(
      'Field "pageSize" must be between 1 and 100 characters'
    );

    expect(getPostListResponse_02.errorsMessages[0].field).toBe('pageNumber');
    expect(getPostListResponse_02.errorsMessages[0].message).toBe('Field "pageNumber" must be a positive integer');
    expect(getPostListResponse_03.errorsMessages[0].field).toBe('sortDirection');
    expect(getPostListResponse_03.errorsMessages[0].message).toBe('Field "sortDirection" must be: asc, desc');
    expect(getPostListResponse_04.errorsMessages[0].field).toBe('sortBy');

    expect(getPostListResponse_04.errorsMessages[0].message).toBe(
      'Field "sortBy" must be: createdAt, title, shortDescription, content, blogId, blogName'
    );
  });

  it('❌ 005 should not update a post by ID without proper basic authorization; PUT /api/posts/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPostId: string = createdPost.id;

    await updatePostById(app, createdPostId, createdBlogId, undefined, HttpStatuses.Unauthorized_401, 'token');

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);
    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('❌ 006 should not update a post by invalid ID; PUT /api/posts/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updatePostByIdResponse_01: any = await updatePostById(
      app,
      invalidPostIds.id_01,
      createdBlogId,
      undefined,
      testStatus
    );

    const updatePostByIdResponse_02: any = await updatePostById(
      app,
      invalidPostIds.id_02,
      createdBlogId,
      undefined,
      testStatus
    );

    const updatePostByIdResponse_03: any = await updatePostById(
      app,
      invalidPostIds.id_03,
      createdBlogId,
      undefined,
      testStatus
    );

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);
    expect(getPostByIdResponse).toEqual(createdPost);
    expect(updatePostByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(updatePostByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(updatePostByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(updatePostByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 007 should not update a post by ID when an invalid body passed; PUT /api/posts/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updatePostByIdResponse_01: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: invalidPostTitles.title_01 },
      testStatus
    );

    const updatePostByIdResponse_02: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: invalidPostTitles.title_02 },
      testStatus
    );

    const updatePostByIdResponse_03: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: invalidPostTitles.title_03 },
      testStatus
    );

    const updatePostByIdResponse_04: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: invalidPostTitles.title_04 },
      testStatus
    );

    const updatePostByIdResponse_05: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: invalidPostTitles.title_05 },
      testStatus
    );

    const updatePostByIdResponse_06: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { shortDescription: invalidPostShortDescriptions.shortDescription_01 },
      testStatus
    );

    const updatePostByIdResponse_07: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { shortDescription: invalidPostShortDescriptions.shortDescription_02 },
      testStatus
    );

    const updatePostByIdResponse_08: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { shortDescription: invalidPostShortDescriptions.shortDescription_03 },
      testStatus
    );

    const updatePostByIdResponse_09: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { content: invalidPostContents.content_01 },
      testStatus
    );

    const updatePostByIdResponse_10: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { content: invalidPostContents.content_02 },
      testStatus
    );

    const updatePostByIdResponse_11: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { content: invalidPostContents.content_03 },
      testStatus
    );

    const updatePostByIdResponse_12: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { blogId: invalidBlogIds.id_01 },
      testStatus
    );

    const updatePostByIdResponse_13: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { blogId: invalidBlogIds.id_02 },
      testStatus
    );

    const updatePostByIdResponse_14: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { blogId: invalidBlogIds.id_03 },
      testStatus
    );

    const updatePostByIdResponse_15: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { blogId: invalidBlogIds.id_04 },
      testStatus
    );

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);
    expect(getPostByIdResponse).toEqual(createdPost);
    expect(updatePostByIdResponse_01.errorsMessages[0].field).toBe('title');
    expect(updatePostByIdResponse_01.errorsMessages[0].message).toBe('Field "title" must not be empty');
    expect(updatePostByIdResponse_02.errorsMessages[0].field).toBe('title');

    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe(
      'Field "title" must be between 1 and 30 characters'
    );

    expect(updatePostByIdResponse_03.errorsMessages[0].field).toBe('title');

    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe(
      'Field "title" must be between 1 and 30 characters'
    );

    expect(updatePostByIdResponse_04.errorsMessages[0].field).toBe('title');

    expect(updatePostByIdResponse_04.errorsMessages[0].message).toBe(
      'Field "title" must be between 1 and 30 characters'
    );

    expect(updatePostByIdResponse_05.errorsMessages[0].field).toBe('title');
    expect(updatePostByIdResponse_05.errorsMessages[0].message).toBe('Field "title" must be a string');
    expect(updatePostByIdResponse_06.errorsMessages[0].field).toBe('shortDescription');
    expect(updatePostByIdResponse_06.errorsMessages[0].message).toBe('Field "shortDescription" must not be empty');
    expect(updatePostByIdResponse_07.errorsMessages[0].field).toBe('shortDescription');
    expect(updatePostByIdResponse_07.errorsMessages[0].message).toBe('Field "shortDescription" must not be empty');
    expect(updatePostByIdResponse_08.errorsMessages[0].field).toBe('shortDescription');
    expect(updatePostByIdResponse_08.errorsMessages[0].message).toBe('Field "shortDescription" must be a string');
    expect(updatePostByIdResponse_09.errorsMessages[0].field).toBe('content');
    expect(updatePostByIdResponse_09.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(updatePostByIdResponse_10.errorsMessages[0].field).toBe('content');
    expect(updatePostByIdResponse_10.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(updatePostByIdResponse_11.errorsMessages[0].field).toBe('content');
    expect(updatePostByIdResponse_11.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updatePostByIdResponse_12.errorsMessages[0].field).toBe('blogId');
    expect(updatePostByIdResponse_12.errorsMessages[0].message).toBe('Field "blogId" must be an ObjectId');
    expect(updatePostByIdResponse_13.errorsMessages[0].field).toBe('blogId');
    expect(updatePostByIdResponse_13.errorsMessages[0].message).toBe('Field "blogId" must be a string');
    expect(updatePostByIdResponse_14.errorsMessages[0].field).toBe('blogId');
    expect(updatePostByIdResponse_14.errorsMessages[0].message).toBe('Field "blogId" must be a string');
    expect(updatePostByIdResponse_15.errorsMessages[0].field).toBe('blogId');
    expect(updatePostByIdResponse_15.errorsMessages[0].message).toBe('Field "blogId" must not be empty');
  });

  it('❌ 008 should not delete a post by ID without proper basic authorization; DELETE /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;

    await deletePostById(app, createdPostId, HttpStatuses.Unauthorized_401, 'token');

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);
    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('❌ 009 should not delete a post by invalid ID; DELETE /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const deletePostByIdResponse_01: any = await deletePostById(app, invalidPostIds.id_01, testStatus);
    const deletePostByIdResponse_02: any = await deletePostById(app, invalidPostIds.id_02, testStatus);
    const deletePostByIdResponse_03: any = await deletePostById(app, invalidPostIds.id_03, testStatus);

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);
    expect(getPostByIdResponse).toEqual(createdPost);
    expect(deletePostByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(deletePostByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deletePostByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(deletePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deletePostByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(deletePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 010 should not create a comment for a post by ID without a valid access token; POST /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_01, undefined, testStatus);
    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_02, undefined, testStatus);
    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_03, undefined, testStatus);
    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_04, undefined, testStatus);
    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_05, undefined, testStatus);
    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_06, undefined, testStatus);
    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_07, undefined, testStatus);
    await createCommentInPost(app, createdPostId, invalidAccessTokens.AT_08, undefined, testStatus);

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(0);
    expect(getCommentListByPostIdResponse.totalCount).toBe(0);
  });

  it('❌ 011 should not create a comment for a post by invalid ID; POST /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createCommentInPostResponse_01: any = await createCommentInPost(
      app,
      invalidPostIds.id_01,
      accessToken,
      undefined,
      testStatus
    );

    const createCommentInPostResponse_02: any = await createCommentInPost(
      app,
      invalidPostIds.id_02,
      accessToken,
      undefined,
      testStatus
    );

    const createCommentInPostResponse_03: any = await createCommentInPost(
      app,
      invalidPostIds.id_03,
      accessToken,
      undefined,
      testStatus
    );

    const createCommentInPostResponse_04: any = await createCommentInPost(
      app,
      invalidPostIds.id_04,
      accessToken,
      undefined,
      testStatus
    );

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(0);
    expect(getCommentListByPostIdResponse.totalCount).toBe(0);
    expect(createCommentInPostResponse_01.errorsMessages[0].field).toBe('postId');
    expect(createCommentInPostResponse_01.errorsMessages[0].message).toBe('Field "postId" must be an ObjectId');
    expect(createCommentInPostResponse_02.errorsMessages[0].field).toBe('postId');
    expect(createCommentInPostResponse_03.errorsMessages[0].message).toBe('Field "postId" must be an ObjectId');
    expect(createCommentInPostResponse_03.errorsMessages[0].field).toBe('postId');
    expect(createCommentInPostResponse_03.errorsMessages[0].message).toBe('Field "postId" must be an ObjectId');
    expect(createCommentInPostResponse_04.errorsMessages[0].field).toBe('postId');
    expect(createCommentInPostResponse_04.errorsMessages[0].message).toBe('Field "postId" must not be empty');
  });

  it('❌ 012 should not create a comment for a post by ID when an invalid body passed; POST /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createCommentInPostResponse_01: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_01 },
      testStatus
    );

    const createCommentInPostResponse_02: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_02 },
      testStatus
    );

    const createCommentInPostResponse_03: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_03 },
      testStatus
    );

    const createCommentInPostResponse_04: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_04 },
      testStatus
    );

    const createCommentInPostResponse_05: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_05 },
      testStatus
    );

    const createCommentInPostResponse_06: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_06 },
      testStatus
    );

    const createCommentInPostResponse_07: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_07 },
      testStatus
    );

    const createCommentInPostResponse_08: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_08 },
      testStatus
    );

    const createCommentInPostResponse_09: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_09 },
      testStatus
    );

    const createCommentInPostResponse_10: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      { content: invalidCommentContents.content_10 },
      testStatus
    );

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(0);
    expect(getCommentListByPostIdResponse.totalCount).toBe(0);
    expect(createCommentInPostResponse_01.errorsMessages[0].field).toBe('content');

    expect(createCommentInPostResponse_01.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(createCommentInPostResponse_02.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_02.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(createCommentInPostResponse_03.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_03.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(createCommentInPostResponse_04.errorsMessages[0].field).toBe('content');

    expect(createCommentInPostResponse_04.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(createCommentInPostResponse_05.errorsMessages[0].field).toBe('content');

    expect(createCommentInPostResponse_05.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(createCommentInPostResponse_06.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_06.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createCommentInPostResponse_07.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_07.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createCommentInPostResponse_08.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_08.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createCommentInPostResponse_09.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_09.errorsMessages[0].message).toBe('Field "content" is required');
    expect(createCommentInPostResponse_10.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_10.errorsMessages[0].message).toBe('Field "content" must be a string');
  });

  it('❌ 013 should not return a list of comments for a post by invalid ID; GET /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    await Promise.all([
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
    ]);

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getCommentListByPostIdResponse_01: any = await getCommentListByPostId(
      app,
      invalidPostIds.id_01,
      undefined,
      testStatus
    );

    const getCommentListByPostIdResponse_02: any = await getCommentListByPostId(
      app,
      invalidPostIds.id_02,
      undefined,
      testStatus
    );

    const getCommentListByPostIdResponse_03: any = await getCommentListByPostId(
      app,
      invalidPostIds.id_03,
      undefined,
      testStatus
    );

    const getCommentListByPostIdResponse_04: any = await getCommentListByPostId(
      app,
      invalidPostIds.id_04,
      undefined,
      testStatus
    );

    const getCommentListByPostIdResponse_05: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId
    );

    expect(getCommentListByPostIdResponse_05.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse_05.items.length).toBe(2);
    expect(getCommentListByPostIdResponse_05.totalCount).toBe(2);
    expect(getCommentListByPostIdResponse_01.errorsMessages[0].field).toBe('postId');
    expect(getCommentListByPostIdResponse_01.errorsMessages[0].message).toBe('Field "postId" must be an ObjectId');
    expect(getCommentListByPostIdResponse_02.errorsMessages[0].field).toBe('postId');
    expect(getCommentListByPostIdResponse_03.errorsMessages[0].message).toBe('Field "postId" must be an ObjectId');
    expect(getCommentListByPostIdResponse_03.errorsMessages[0].field).toBe('postId');
    expect(getCommentListByPostIdResponse_03.errorsMessages[0].message).toBe('Field "postId" must be an ObjectId');
    expect(getCommentListByPostIdResponse_04.errorsMessages[0].field).toBe('postId');
    expect(getCommentListByPostIdResponse_04.errorsMessages[0].message).toBe('Field "postId" must not be empty');
  });

  it('❌ 014 should not return a list of comments for a post by ID when invalid pagination settings passed; GET /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const validUrl: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${validCommentsPaginationSettings.pageSize}&pageNumber=${validCommentsPaginationSettings.pageNumber}&sortDirection=${validCommentsPaginationSettings.sortDirection}&sortBy=${validCommentsPaginationSettings.sortBy}`;
    const invalidUrl_01: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${invalidCommentsPaginationSettings.pageSize}&pageNumber=${validCommentsPaginationSettings.pageNumber}&sortDirection=${validCommentsPaginationSettings.sortDirection}&sortBy=${validCommentsPaginationSettings.sortBy}`;
    const invalidUrl_02: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${validCommentsPaginationSettings.pageSize}&pageNumber=${invalidCommentsPaginationSettings.pageNumber}&sortDirection=${validCommentsPaginationSettings.sortDirection}&sortBy=${validCommentsPaginationSettings.sortBy}`;
    const invalidUrl_03: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${validCommentsPaginationSettings.pageSize}&pageNumber=${validCommentsPaginationSettings.pageNumber}&sortDirection=${invalidCommentsPaginationSettings.sortDirection}&sortBy=${validCommentsPaginationSettings.sortBy}`;
    const invalidUrl_04: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${validCommentsPaginationSettings.pageSize}&pageNumber=${validCommentsPaginationSettings.pageNumber}&sortDirection=${validCommentsPaginationSettings.sortDirection}&sortBy=${invalidCommentsPaginationSettings.sortBy}`;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    await Promise.all([
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
    ]);

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getCommentListByPostIdResponse_01: any = await getCommentListByPostId(
      app,
      createdPostId,
      invalidUrl_01,
      testStatus
    );

    const getCommentListByPostIdResponse_02: any = await getCommentListByPostId(
      app,
      createdPostId,
      invalidUrl_02,
      testStatus
    );

    const getCommentListByPostIdResponse_03: any = await getCommentListByPostId(
      app,
      createdPostId,
      invalidUrl_03,
      testStatus
    );

    const getCommentListByPostIdResponse_04: any = await getCommentListByPostId(
      app,
      createdPostId,
      invalidUrl_04,
      testStatus
    );

    const getCommentListByPostIdResponse_05: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId,
      validUrl
    );

    expect(getCommentListByPostIdResponse_05.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse_05.items.length).toBe(5);
    expect(getCommentListByPostIdResponse_05.totalCount).toBe(6);
    expect(getCommentListByPostIdResponse_01.errorsMessages[0].field).toBe('pageSize');

    expect(getCommentListByPostIdResponse_01.errorsMessages[0].message).toBe(
      'Field "pageSize" must be between 1 and 100 characters'
    );

    expect(getCommentListByPostIdResponse_02.errorsMessages[0].field).toBe('pageNumber');

    expect(getCommentListByPostIdResponse_02.errorsMessages[0].message).toBe(
      'Field "pageNumber" must be a positive integer'
    );

    expect(getCommentListByPostIdResponse_03.errorsMessages[0].field).toBe('sortDirection');

    expect(getCommentListByPostIdResponse_03.errorsMessages[0].message).toBe(
      'Field "sortDirection" must be: asc, desc'
    );

    expect(getCommentListByPostIdResponse_04.errorsMessages[0].field).toBe('sortBy');

    expect(getCommentListByPostIdResponse_04.errorsMessages[0].message).toBe(
      'Field "sortBy" must be: createdAt, postId, content, commentatorInfo'
    );
  });
});
