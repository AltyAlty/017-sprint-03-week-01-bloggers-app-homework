import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { GetPostListQueryInputDTO } from '../input-dto/query/get-post-list-query.input-dto';
import { postsQueryService } from '../../application/posts.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { PaginatedPostListOutputDTO } from '../output-dto/paginated-post-list.output-dto';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { PostSortFieldQueryInputDTO } from '../input-dto/query/post-sort-field-query.input-dto';
import { getSanitizedQueryInputWithDefaultPaginationSettings } from '../../../core/utils/pagination/get-sanitized-query-input-with-default-pagination-settings';

/*Функция-обработчик для GET-запросов по получению постов с пагинацией, используя query-параметры.*/
export const getPostListHandler = async (
  req: Request<{}, {}, {}, GetPostListQueryInputDTO>,
  res: Response<PaginatedPostListOutputDTO | ExtensionType[]>
) => {
  try {
    /*Санитизируем query-параметры и добавляем к ним дефолтные настройки пагинации.*/
    const sanitizedQueryInputWithDefaultPaginationSettings = getSanitizedQueryInputWithDefaultPaginationSettings<
      GetPostListQueryInputDTO,
      PostSortFieldQueryInputDTO
    >(req);

    /*Просим query-сервис "postsQueryService" найти посты.*/
    const paginatedPostListResult: Result<{ paginatedPostListOutput: PaginatedPostListOutputDTO } | null> =
      await postsQueryService.findAll(sanitizedQueryInputWithDefaultPaginationSettings);

    /*Получаем HTTP-статус операции по поиску постов.*/
    const paginatedPostListResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(paginatedPostListResult.status);

    /*Если был указан блог для постов и этот блог не был найден, то сообщаем об этом клиенту.*/
    if (paginatedPostListResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(paginatedPostListResultHttpStatus).send(paginatedPostListResult.extensions);
    }

    /*Если посты были найдены, то отправляем их клиенту.*/
    res.status(paginatedPostListResultHttpStatus).send(paginatedPostListResult.data!.paginatedPostListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
