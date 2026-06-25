import { Request, Response } from 'express';
import { GetCommentListByPostIdQueryInputDTO } from '../../../comments/routes/input-dto/query/get-comment-list-by-post-id-query.input-dto';
import { commentsQueryService } from '../../../comments/application/comments.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { PaginatedCommentListOutputDTO } from '../../../comments/routes/output-dto/paginated-comment-list.output-dto';
import { getSanitizedQueryInputWithDefaultPaginationSettings } from '../../../core/utils/pagination/get-sanitized-query-input-with-default-pagination-settings';
import { CommentSortFieldQueryInputDTO } from '../../../comments/routes/input-dto/query/comment-sort-field-query.input-dto';
import { GetCommentListByPostIdUriInputDTO } from '../../../comments/routes/input-dto/uri/get-comment-list-by-post-id-uri.input-dto';

/*Функция-обработчик для GET-запросов по получению комментариев с пагинацией в посте по ID, используя URI-параметры и
query-параметры.*/
export const getCommentListByPostIdHandler = async (
  req: Request<GetCommentListByPostIdUriInputDTO, {}, {}, GetCommentListByPostIdQueryInputDTO>,
  res: Response<PaginatedCommentListOutputDTO | ExtensionType[]>
) => {
  try {
    /*Получаем ID поста.*/
    const postId: string = req.params.postId;

    /*Санитизируем query-параметры и добавляем к ним дефолтные настройки пагинации.*/
    const sanitizedQueryInputWithDefaultPaginationSettings = getSanitizedQueryInputWithDefaultPaginationSettings<
      GetCommentListByPostIdQueryInputDTO,
      CommentSortFieldQueryInputDTO
    >(req);

    /*Просим query-сервис "commentsQueryService" найти комментарии в посте по ID.*/
    const paginatedCommentListResult: Result<{ paginatedCommentListOutput: PaginatedCommentListOutputDTO } | null> =
      await commentsQueryService.findAllByPostId(postId, sanitizedQueryInputWithDefaultPaginationSettings);

    /*Получаем HTTP-статус операции по поиску комментариев в посте по ID.*/
    const paginatedCommentListResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(
      paginatedCommentListResult.status
    );

    /*Если комментарии не были найдены в посте, то сообщаем об этом клиенту.*/
    if (paginatedCommentListResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(paginatedCommentListResultHttpStatus).send(paginatedCommentListResult.extensions);
    }

    /*Если комментарии были найдены в посте, то отправляем их клиенту.*/
    res.status(paginatedCommentListResultHttpStatus).send(paginatedCommentListResult.data!.paginatedCommentListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
