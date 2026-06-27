import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { GetPostListByBlogIdQueryInputDTO } from '../../../posts/routes/input-dto/query/get-post-list-by-blog-id-query.input-dto';
import { postsQueryService } from '../../../posts/application/posts.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { PaginatedPostListOutputDTO } from '../../../posts/routes/output-dto/paginated-post-list.output-dto';
import { getSanitizedQueryInputWithDefaultPaginationSettings } from '../../../core/utils/pagination/get-sanitized-query-input-with-default-pagination-settings';
import { PostSortFieldQueryInputDTO } from '../../../posts/routes/input-dto/query/post-sort-field-query.input-dto';
import { GetPostListByBlogIdUriInputDTO } from '../../../posts/routes/input-dto/uri/get-post-list-by-blog-id-uri.input-dto';

/*Функция-обработчик для GET-запросов по получению постов с пагинацией в блоге по ID, используя URI-параметры и
query-параметры.*/
export const getPostListByBlogIdHandler = async (
  req: Request<GetPostListByBlogIdUriInputDTO, {}, {}, GetPostListByBlogIdQueryInputDTO>,
  res: Response<PaginatedPostListOutputDTO | ExtensionType[]>
): Promise<void | Response<PaginatedPostListOutputDTO | ExtensionType[]>> => {
  try {
    /*Получаем ID блога.*/
    const blogId: string = req.params.blogId;

    /*Санитизируем query-параметры и добавляем к ним дефолтные настройки пагинации.*/
    const sanitizedQueryInputWithDefaultPaginationSettings = getSanitizedQueryInputWithDefaultPaginationSettings<
      GetPostListByBlogIdQueryInputDTO,
      PostSortFieldQueryInputDTO
    >(req);

    /*Просим query-сервис "postsQueryService" найти посты в блоге по ID.*/
    const paginatedPostListResult: Result<{ paginatedPostListOutput: PaginatedPostListOutputDTO } | null> =
      await postsQueryService.findAll(sanitizedQueryInputWithDefaultPaginationSettings, blogId);

    /*Получаем HTTP-статус операции по поиску постов в блоге по ID.*/
    const paginatedPostListResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(paginatedPostListResult.status);

    /*Если посты в блоге не были найдены, то сообщаем об этом клиенту.*/
    if (paginatedPostListResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(paginatedPostListResultHttpStatus).send(paginatedPostListResult.extensions);
    }

    /*Если посты в блоге были найдены, то отправляем их клиенту.*/
    return res.status(paginatedPostListResultHttpStatus).send(paginatedPostListResult.data!.paginatedPostListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
