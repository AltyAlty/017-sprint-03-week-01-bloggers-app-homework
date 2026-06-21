import { Result } from '../../core/types/result/result.type';
import { CommentOutputDTO } from '../routes/output-dto/comment.output-dto';
import { commentsQueryRepository } from '../repositories/comments.query-repository';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { mapToCommentOutputDTO } from '../repositories/mappers/map-to-comment-output-dto.util';
import { GetCommentListInPostQueryInputDTO } from '../routes/input-dto/get-comment-list-in-post-query.input-dto';
import { PaginatedCommentListOutputDTO } from '../routes/output-dto/paginated-comment-list.output-dto';
import { mapToPaginatedCommentListOutputDTO } from '../repositories/mappers/map-to-paginated-comment-list-output-dto.util';
import { PostOutputDTO } from '../../posts/routes/output-dto/post.output-dto';
import { postsQueryService } from '../../posts/application/posts.query-service';
import { CommentDBType } from '../repositories/types/comment-db.type';

/*Query-сервис "commentsQueryService" для работы с комментариями.*/
export const commentsQueryService = {
  /*Метод "findById()" для поиска комментария по ID.*/
  async findById(commentId: string): Promise<Result<{ commentOutput: CommentOutputDTO } | null>> {
    /*Просим query-репозиторий "commentsQueryRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await commentsQueryRepository.findById(commentId);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'commentId', message: 'Not Found' }],
      };
    }

    /*Если комментарий был найден, то преобразовываем комментарий из БД в подготовленный для отправки клиенту
    комментарий.*/
    const commentOutput: CommentOutputDTO = mapToCommentOutputDTO(commentDB);

    /*Возвращаем ResultObject c преобразованным комментарием.*/
    return {
      status: ResultStatuses.Ok,
      data: { commentOutput },
      extensions: [],
    };
  },

  /*Метод "findManyByPostId()" для поиска комментариев в посте по ID.*/
  async findManyByPostId(
    postId: string,
    queryDTO: GetCommentListInPostQueryInputDTO
  ): Promise<Result<{ paginatedCommentListOutput: PaginatedCommentListOutputDTO } | null>> {
    /*Просим query-сервис "postsQueryService" найти пост по ID.*/
    const postResult: Result<{ postOutput: PostOutputDTO } | null> = await postsQueryService.findById(postId);
    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (postResult.status !== ResultStatuses.Ok) return postResult as Result;

    /*Если пост был найден, то просим query-репозиторий "commentsQueryRepository" найти комментарии в посте по ID в
    БД.*/
    const { items, totalCount }: { items: CommentDBType[]; totalCount: number } =
      await commentsQueryRepository.findManyByPostId(postId, queryDTO);

    /*Преобразовываем комментарии из БД в подготовленные для пагинации комментарии.*/
    const paginatedCommentListOutput: PaginatedCommentListOutputDTO = mapToPaginatedCommentListOutputDTO(items, {
      pageNumber: queryDTO.pageNumber,
      pageSize: queryDTO.pageSize,
      totalCount,
    });

    /*Возвращаем ResultObject c преобразованными для пагинации комментариями.*/
    return {
      status: ResultStatuses.Ok,
      data: { paginatedCommentListOutput },
      extensions: [],
    };
  },
};
