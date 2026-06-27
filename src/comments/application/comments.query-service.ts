import { Result } from '../../core/types/result/result.type';
import { CommentOutputDTO } from '../routes/output-dto/comment.output-dto';
import { commentsQueryRepository } from '../repositories/comments.query-repository';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { mapToCommentOutputDTO } from '../repositories/mappers/map-to-comment-output-dto.util';
import { GetCommentListByPostIdQueryInputDTO } from '../routes/input-dto/query/get-comment-list-by-post-id-query.input-dto';
import { PaginatedCommentListOutputDTO } from '../routes/output-dto/paginated-comment-list.output-dto';
import { mapToPaginatedCommentListOutputDTO } from '../repositories/mappers/map-to-paginated-comment-list-output-dto.util';
import { PostOutputDTO } from '../../posts/routes/output-dto/post.output-dto';
import { postsQueryService } from '../../posts/application/posts.query-service';
import { CommentDBType } from '../repositories/types/comment-db.type';

/*Query-сервис для работы с комментариями.*/
export const commentsQueryService = {
  /*Метод для поиска комментария по ID.*/
  async findById(id: string): Promise<Result<{ commentOutput: CommentOutputDTO } | null>> {
    /*Просим query-репозиторий "commentsQueryRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await commentsQueryRepository.findById(id);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Comment not found' }],
      };
    }

    /*Если комментарий был найден, то преобразовываем комментарий из БД в подготовленный для отправки клиенту
    комментарий.*/
    const commentOutput: CommentOutputDTO = mapToCommentOutputDTO(commentDB);

    /*Возвращаем ResultObject с преобразованным комментарием.*/
    return {
      status: ResultStatuses.Ok,
      data: { commentOutput },
      extensions: [],
    };
  },

  /*Метод для поиска комментариев по ID поста.*/
  async findAllByPostId(
    postId: string,
    queryDTO: GetCommentListByPostIdQueryInputDTO
  ): Promise<Result<{ paginatedCommentListOutput: PaginatedCommentListOutputDTO } | null>> {
    /*Просим query-сервис "postsQueryService" найти пост по ID.*/
    const postResult: Result<{ postOutput: PostOutputDTO } | null> = await postsQueryService.findById(postId);
    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (postResult.status !== ResultStatuses.Ok) return postResult as Result;

    /*Если пост был найден, то просим query-репозиторий "commentsQueryRepository" найти комментарии по ID поста в БД.*/
    const { items, totalCount }: { items: CommentDBType[]; totalCount: number } =
      await commentsQueryRepository.findAllByPostId(postId, queryDTO);

    /*Преобразовываем комментарии из БД в подготовленные для пагинации комментарии.*/
    const paginatedCommentListOutput: PaginatedCommentListOutputDTO = mapToPaginatedCommentListOutputDTO(items, {
      pageNumber: queryDTO.pageNumber,
      pageSize: queryDTO.pageSize,
      totalCount,
    });

    /*Возвращаем ResultObject с преобразованными для пагинации комментариями.*/
    return {
      status: ResultStatuses.Ok,
      data: { paginatedCommentListOutput },
      extensions: [],
    };
  },
};
