import 'dotenv/config';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { createPost } from '../../utils/posts/create-post.test-util';
import { createUser } from '../../utils/users/create-user.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createCommentForPost } from '../../utils/posts/create-comment-for-post.test-util';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { UpdateCommentByIdInputDTO } from '../../../src/comments/routes/input-dto/update-comment-by-id.input-dto';
import { updateCommentById } from '../../utils/comments/update-comment-by-id.test-util';
import { getUpdateCommentInputDTO } from '../../utils/comments/input-dto-utils/get-update-comment-input-dto.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { deleteCommentById } from '../../utils/comments/delete-comment-by-id.test-util';
import { invalidAccessTokens } from '../../test-data/auth.test-data';
import { invalidCommentContents, invalidCommentIds } from '../../test-data/comments.test-data';

describe('Comments API Validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it("❌ 001 should not return a comment by invalid ID; 003. GET /api/comments/:id'", async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getCommentByIdResponse_01: any = await getCommentById(app, invalidCommentIds.id_01, testStatus);
    const getCommentByIdResponse_02: any = await getCommentById(app, invalidCommentIds.id_02, testStatus);
    const getCommentByIdResponse_03: any = await getCommentById(app, invalidCommentIds.id_03, testStatus);

    const getCommentByIdResponse_04: CommentOutputDTO = await getCommentById(app, createdCommentId);
    expect(getCommentByIdResponse_04).toEqual(createdComment);
    expect(getCommentByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(getCommentByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(getCommentByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(getCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(getCommentByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(getCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 002 should not update a comment by ID when an invalid access token passed; 001. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const updateCommentData: UpdateCommentByIdInputDTO = getUpdateCommentInputDTO();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_01, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_02, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_03, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_04, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_05, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_06, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_07, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_08, updateCommentData, testStatus);
    await updateCommentById(app, createdCommentId, invalidAccessTokens.AT_09, updateCommentData, testStatus);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);
    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 003 should not update a comment by invalid ID; 001. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const updateCommentData: UpdateCommentByIdInputDTO = getUpdateCommentInputDTO();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updateCommentByIdResponse_01: any = await updateCommentById(
      app,
      invalidCommentIds.id_01,
      accessToken,
      updateCommentData,
      testStatus
    );

    const updateCommentByIdResponse_02: any = await updateCommentById(
      app,
      invalidCommentIds.id_02,
      accessToken,
      updateCommentData,
      testStatus
    );

    const updateCommentByIdResponse_03: any = await updateCommentById(
      app,
      invalidCommentIds.id_03,
      accessToken,
      updateCommentData,
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);
    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(updateCommentByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(updateCommentByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(updateCommentByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(updateCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(updateCommentByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(updateCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });

  it('❌ 004 should not update a comment by ID when an invalid body passed; 001. PUT /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updateCommentByIdResponse_01: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_01 },
      testStatus
    );

    const updateCommentByIdResponse_02: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_02 },
      testStatus
    );

    const updateCommentByIdResponse_03: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_03 },
      testStatus
    );

    const updateCommentByIdResponse_04: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_04 },
      testStatus
    );

    const updateCommentByIdResponse_05: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_05 },
      testStatus
    );

    const updateCommentByIdResponse_06: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_06 },
      testStatus
    );

    const updateCommentByIdResponse_07: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_07 },
      testStatus
    );

    const updateCommentByIdResponse_08: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_08 },
      testStatus
    );

    const updateCommentByIdResponse_09: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_09 },
      testStatus
    );

    const updateCommentByIdResponse_10: any = await updateCommentById(
      app,
      createdCommentId,
      accessToken,
      { content: invalidCommentContents.content_10 },
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);
    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(updateCommentByIdResponse_01.errorsMessages[0].field).toBe('content');

    expect(updateCommentByIdResponse_01.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(updateCommentByIdResponse_02.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_02.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(updateCommentByIdResponse_03.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "content" must not be empty');
    expect(updateCommentByIdResponse_04.errorsMessages[0].field).toBe('content');

    expect(updateCommentByIdResponse_04.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(updateCommentByIdResponse_05.errorsMessages[0].field).toBe('content');

    expect(updateCommentByIdResponse_05.errorsMessages[0].message).toBe(
      'Field "content" must be between 20 and 300 characters'
    );

    expect(updateCommentByIdResponse_06.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_06.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updateCommentByIdResponse_07.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_07.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updateCommentByIdResponse_08.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_08.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updateCommentByIdResponse_09.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_09.errorsMessages[0].message).toBe('Field "content" is required');
    expect(updateCommentByIdResponse_10.errorsMessages[0].field).toBe('content');
    expect(updateCommentByIdResponse_10.errorsMessages[0].message).toBe('Field "content" must be a string');
  });

  it('❌ 005 should not delete a comment by ID when an invalid access token passed; 002. DELETE /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_01, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_02, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_03, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_04, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_05, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_06, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_07, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_08, testStatus);
    await deleteCommentById(app, createdCommentId, invalidAccessTokens.AT_09, testStatus);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);
    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('❌ 006 should not delete a comment by invalid ID; 002. DELETE /api/comments/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUserReturnAccessToken(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment: CommentOutputDTO = await createCommentForPost(app, createdPostId, accessToken);
    const createdCommentId: string = createdComment.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const deleteCommentByIdResponse_01: any = await deleteCommentById(
      app,
      invalidCommentIds.id_01,
      accessToken,
      testStatus
    );

    const deleteCommentByIdResponse_02: any = await deleteCommentById(
      app,
      invalidCommentIds.id_02,
      accessToken,
      testStatus
    );

    const deleteCommentByIdResponse_03: any = await deleteCommentById(
      app,
      invalidCommentIds.id_03,
      accessToken,
      testStatus
    );

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);
    expect(getCommentByIdResponse).toEqual(createdComment);
    expect(deleteCommentByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(deleteCommentByIdResponse_01.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deleteCommentByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(deleteCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
    expect(deleteCommentByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(deleteCommentByIdResponse_03.errorsMessages[0].message).toBe('Field "id" must be an ObjectId');
  });
});
