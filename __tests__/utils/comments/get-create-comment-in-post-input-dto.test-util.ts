import { CreateCommentInPostInputDTO } from '../../../src/comments/routes/input-dto/create-comment-in-post.input-dto';

export const getCreateCommentInPostInputDTO = (): CreateCommentInPostInputDTO => {
  return {
    content: 'some comment content 001',
  };
};
