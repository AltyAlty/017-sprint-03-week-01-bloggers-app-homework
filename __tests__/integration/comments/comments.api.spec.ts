import 'dotenv/config';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { createPost } from '../../utils/posts/create-post.test-util';
import { createUser } from '../../utils/users/create-user.test-util';
import { loginUserReturnAccessToken } from '../../utils/auth/login-user-return-access-token.test-util';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createCommentForPost } from '../../utils/posts/create-comment-for-post.test-util';
import { getCommentById } from '../../utils/comments/get-comment-by-id.test-util';
import { updateCommentById } from '../../utils/comments/update-comment-by-id.test-util';
import { UpdateCommentByIdInputDTO } from '../../../src/comments/routes/input-dto/update-comment-by-id.input-dto';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { getUpdateCommentInputDTO } from '../../utils/comments/input-dto-utils/get-update-comment-input-dto.test-util';
import { deleteCommentById } from '../../utils/comments/delete-comment-by-id.test-util';

describe('Comments API', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should return a comment by ID; 003. GET /api/comments/:id', async () => {
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

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);

    expect(getCommentByIdResponse).toEqual(createdComment);
  });

  it('✅ 002 should update a comment by ID when a valid access token passed; 001. PUT /api/comments/:id', async () => {
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

    await updateCommentById(app, createdCommentId, accessToken, updateCommentData);

    const getCommentByIdResponse: CommentOutputDTO = await getCommentById(app, createdCommentId);

    expect(getCommentByIdResponse).toEqual({
      id: createdCommentId,
      content: updateCommentData.content,
      commentatorInfo: createdComment.commentatorInfo,
      createdAt: createdComment.createdAt,
    });
  });

  it('✅ 003 should delete a comment by ID when a valid access token passed; 002. DELETE /api/comments/:id', async () => {
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

    await deleteCommentById(app, createdCommentId, accessToken);

    await getCommentById(app, createdCommentId, HttpStatuses.NotFound_404);
  });
});
