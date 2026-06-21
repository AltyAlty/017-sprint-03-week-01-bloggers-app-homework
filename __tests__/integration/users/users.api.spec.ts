import 'dotenv/config';
import { SETTINGS } from '../../../src/core/settings/settings';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { createUser } from '../../utils/users/create-user.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { getUserList } from '../../utils/users/get-user-list.test-util';
import { PaginatedUserListOutputDTO } from '../../../src/users/routes/output-dto/paginated-user-list.output-dto';
import { deleteUserById } from '../../utils/users/delete-user-by-id.test-util';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { createPost } from '../../utils/posts/create-post.test-util';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createCommentInPost } from '../../utils/posts/create-comment-in-post.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { getPostById } from '../../utils/posts/get-post-by-id.test-util';
import { getCommentListByPostId } from '../../utils/posts/get-comment-list-by-post-id.test-util';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { PaginatedCommentListOutputDTO } from '../../../src/comments/routes/output-dto/paginated-comment-list.output-dto';
import { validUserData, validUsersPaginationSettings } from '../../test-data/users.test-data';

describe('Users API', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should create a user; POST /api/users', async () => {
    const createdUser: UserOutputDTO = await createUser(app);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(1);
    expect(getUserListResponse.totalCount).toBe(1);
    expect(getUserListResponse.items[0]).toEqual(createdUser);
  });

  it('✅ 002 should return a list of users; GET /api/users', async () => {
    await Promise.all([createUser(app), createUser(app)]);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);

    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(2);
    expect(getUserListResponse.totalCount).toBe(2);
  });

  it('✅ 003 should return a list of users when valid pagination settings passed; GET /api/users', async () => {
    const url: string = `${SETTINGS.USERS_PATH}?pageSize=${validUsersPaginationSettings.pageSize}&pageNumber=${validUsersPaginationSettings.pageNumber}&searchLoginTerm=${validUsersPaginationSettings.searchLoginTerm}&searchEmailTerm=${validUsersPaginationSettings.searchEmailTerm}&sortDirection=${validUsersPaginationSettings.sortDirection}&sortBy=${validUsersPaginationSettings.sortBy}`;

    await Promise.all([
      createUser(app, validUserData.data_01),
      createUser(app, validUserData.data_02),
      createUser(app, validUserData.data_03),
      createUser(app, validUserData.data_04),
      createUser(app, validUserData.data_05),
      createUser(app, validUserData.data_06),
    ]);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app, url);

    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(3);
    expect(getUserListResponse.totalCount).toBe(3);
    expect(getUserListResponse.items[0].login).toBe(validUserData.data_06.login);
    expect(getUserListResponse.items[1].login).toBe(validUserData.data_04.login);
    expect(getUserListResponse.items[2].login).toBe(validUserData.data_03.login);
  });

  it('✅ 004 should delete a user by ID; DELETE /api/users/:id', async () => {
    const createdUser: UserOutputDTO = await createUser(app);
    const createdUserId: string = createdUser.id;

    await deleteUserById(app, createdUserId);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(0);
    expect(getUserListResponse.totalCount).toBe(0);
  });

  it('✅ 005 should delete a user with their comments by ID; DELETE /api/users/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment_01: CommentOutputDTO = await createCommentInPost(app, createdPostId, accessToken);
    const createdComment_02: CommentOutputDTO = await createCommentInPost(app, createdPostId, accessToken);
    const createdCommentId_01: string = createdComment_01.id;
    const createdCommentId_02: string = createdComment_02.id;
    const testStatus: HttpStatuses = HttpStatuses.NotFound_404;

    await deleteUserById(app, createdUserId);

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(0);
    expect(getUserListResponse.totalCount).toBe(0);
    await getPostById(app, createdPostId);
    await getCommentById(app, createdCommentId_01, testStatus);
    await getCommentById(app, createdCommentId_02, testStatus);

    const getCommentListByPostIdResponse: PaginatedCommentListOutputDTO = await getCommentListByPostId(
      app,
      createdPostId
    );

    expect(getCommentListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentListByPostIdResponse.items.length).toBe(0);
    expect(getCommentListByPostIdResponse.totalCount).toBe(0);
  });
});
