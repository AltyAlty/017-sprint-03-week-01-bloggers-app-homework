import { PaginatedCommentListOutputDTO } from '../../routes/output-dto/paginated-comment-list.output-dto';
import { CommentOutputDTO } from '../../routes/output-dto/comment.output-dto';
import { CommentDBType } from '../types/comment-db.type';

/*Функция "mapToPaginatedCommentListOutputDTO()" преобразовывает комментарии из БД в подготовленные для пагинации
комментарии.*/
export const mapToPaginatedCommentListOutputDTO = (
  comments: CommentDBType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedCommentListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: comments.map(
      (comment): CommentOutputDTO => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
      })
    ),
  };
};
