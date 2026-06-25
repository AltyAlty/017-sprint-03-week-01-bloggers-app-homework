import { CreateCommentForPostInputDTO } from '../../../src/comments/routes/input-dto/create-comment-for-post.input-dto';

export const getCreateCommentInPostInputDTO = (): CreateCommentForPostInputDTO => {
  return {
    content: 'some comment content 001',
  };
};
