import 'dotenv/config';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import { createPost } from '../../utils/posts/create-post.test-util';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { getPostById } from '../../utils/posts/get-post-by-id.test-util';
import { UpdatePostByIdInputDTO } from '../../../src/posts/routes/input-dto/update-post-by-id.input-dto';
import { updatePostById } from '../../utils/posts/update-post-by-id.test-util';
import { getUpdatePostInputDTO } from '../../utils/posts/input-dto-utils/get-update-post-input-dto.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { createCommentForPost } from '../../utils/posts/create-comment-for-post.test-util';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createUser } from '../../utils/users/create-user.test-util';
import { getPostList } from '../../utils/posts/get-post-list.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { PaginatedPostListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-post-list.output-dto';
import { deletePostById } from '../../utils/posts/delete-post-by-id.test-util';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { getCommentListByPostId } from '../../utils/posts/get-comment-list-by-post-id.test-util';
import { PaginatedCommentListOutputDTO } from '../../../src/comments/routes/output-dto/paginated-comment-list.output-dto';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { validPostsPaginationSettings } from '../../test-data/posts.test-data';
import { validCommentsPaginationSettings } from '../../test-data/comments.test-data';

describe('Posts API', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should create a post; 004. POST /api/posts', async () => {
    const createdPost: PostOutputDTO = await createPost(app);

    const createdPostId: string = createdPost.id;
    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);
    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('✅ 002 should return a post by ID; 005. GET /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('✅ 003 should return a list of posts; 003. GET /api/posts', async () => {
    await Promise.all([createPost(app), createPost(app)]);

    const getPostListResponse: PaginatedPostListOutputDTO = await getPostList(app);

    expect(getPostListResponse.items).toBeInstanceOf(Array);
    expect(getPostListResponse.items.length).toBe(2);
    expect(getPostListResponse.totalCount).toBe(2);
  });

  it('✅ 004 should return a list of posts when valid pagination settings passed; 003. GET /api/posts', async () => {
    const url: string = `${SETTINGS.POSTS_PATH}?pageSize=${validPostsPaginationSettings.pageSize}&pageNumber=${validPostsPaginationSettings.pageNumber}&sortDirection=${validPostsPaginationSettings.sortDirection}&sortBy=${validPostsPaginationSettings.sortBy}`;

    await Promise.all([
      createPost(app),
      createPost(app),
      createPost(app),
      createPost(app),
      createPost(app),
      createPost(app),
    ]);

    const getPostListResponse: PaginatedPostListOutputDTO = await getPostList(app, url);

    expect(getPostListResponse.items).toBeInstanceOf(Array);
    expect(getPostListResponse.items.length).toBe(5);
    expect(getPostListResponse.totalCount).toBe(6);
  });

  it('✅ 005 should update a post by ID; 006. PUT /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createdPostBlogId: string = createdPost.blogId;
    const updatePostData: UpdatePostByIdInputDTO = getUpdatePostInputDTO(createdPostBlogId);

    await updatePostById(app, createdPostId, createdPostBlogId, updatePostData);

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse).toEqual({
      id: createdPostId,
      title: updatePostData.title,
      shortDescription: updatePostData.shortDescription,
      content: updatePostData.content,
      blogId: createdPostBlogId,
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
    });
  });

  it('✅ 006 should delete a post by ID; 007. DELETE /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;

    await deletePostById(app, createdPostId);

    await getPostById(app, createdPostId, HttpStatuses.NotFound_404);
  });

  it('✅ 007 should delete a post with its comments by ID; 007. DELETE /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment_01: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdComment_02: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdCommentId_01: string = createdComment_01.id;
    const createdCommentId_02: string = createdComment_02.id;
    const testStatus: HttpStatuses = HttpStatuses.NotFound_404;

    await deletePostById(app, createdPostId);

    await getPostById(app, createdPostId, testStatus);
    await getCommentListByPostId(app, createdPostId, undefined, testStatus);
    await getCommentById(app, createdCommentId_01, testStatus);
    await getCommentById(app, createdCommentId_02, testStatus);
  });

  it('✅ 008 should create a comment for a post by ID; 002. POST /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);

    const createdCommentId: string = createdComment.id;
    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);
    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(getCommentByIdResponse.commentatorInfo.userId).toBe(createdUser.id);
    expect(getCommentByIdResponse.commentatorInfo.userLogin).toBe(createdUser.login);
  });

  it('✅ 009 should return a list of comments for a post by ID; 001. GET /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    await Promise.all([
      createCommentForPost(app, createdPostId, accessToken),
      createCommentForPost(app, createdPostId, accessToken),
    ]);

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(2);
    expect(getCommentListByPostIdResponse.totalCount).toBe(2);
  });

  it('✅ 010 should return a list of comments for a post by ID when valid pagination settings passed; 001. GET /api/posts/:postId/comments', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const url: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${validCommentsPaginationSettings.pageSize}&pageNumber=${validCommentsPaginationSettings.pageNumber}&sortDirection=${validCommentsPaginationSettings.sortDirection}&sortBy=${validCommentsPaginationSettings.sortBy}`;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    await Promise.all([
      createCommentForPost(app, createdPostId, accessToken),
      createCommentForPost(app, createdPostId, accessToken),
      createCommentForPost(app, createdPostId, accessToken),
      createCommentForPost(app, createdPostId, accessToken),
      createCommentForPost(app, createdPostId, accessToken),
      createCommentForPost(app, createdPostId, accessToken),
    ]);

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId,
      url
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(5);
    expect(getCommentListByPostIdResponse.totalCount).toBe(6);
  });
});
