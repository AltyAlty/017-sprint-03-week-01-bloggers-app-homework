import { UpdateCommentByIdInputDTO } from '../../../../src/comments/routes/input-dto/update-comment-by-id.input-dto';

export const getUpdateCommentInputDTO = (): UpdateCommentByIdInputDTO => {
  return {
    content: 'some updated comment content 001',
  };
};
