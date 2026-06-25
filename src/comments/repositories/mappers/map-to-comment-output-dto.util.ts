import { CommentOutputDTO } from '../../routes/output-dto/comment.output-dto';
import { CommentDBType } from '../types/comment-db.type';

/*Функция для преобразования комментария из БД в подготовленный для отправки клиенту комментарий.*/
export const mapToCommentOutputDTO = (comment: CommentDBType): CommentOutputDTO => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: { userId: comment.commentatorInfo.userId, userLogin: comment.commentatorInfo.userLogin },
    createdAt: comment.createdAt,
  };
};
