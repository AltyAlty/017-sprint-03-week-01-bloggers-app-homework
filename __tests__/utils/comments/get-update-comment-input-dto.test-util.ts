import { UpdateCommentInputDTO } from '../../../src/comments/routes/input-dto/update-comment.input-dto';

export const getUpdateCommentInputDTO = (): UpdateCommentInputDTO => {
  return {
    content: 'some updated comment content 001',
  };
};
