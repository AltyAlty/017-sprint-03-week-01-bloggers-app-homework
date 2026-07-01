import { CreateCommentForPostInputDTO } from '../../../../src/comments/routes/input-dto/create-comment-for-post.input-dto';

export const getCreateCommentForPostInputDTO = (): CreateCommentForPostInputDTO => {
  return {
    content: 'some comment content 001',
  };
};
