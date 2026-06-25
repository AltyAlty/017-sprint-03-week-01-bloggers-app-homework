import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { GetBlogListQueryInputDTO } from '../input-dto/query/get-blog-list-query.input-dto';
import { blogsQueryService } from '../../application/blogs.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { PaginatedBlogListOutputDTO } from '../output-dto/paginated-blog-list.output-dto';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { Result } from '../../../core/types/result/result.type';
import { getSanitizedQueryInputWithDefaultPaginationSettings } from '../../../core/utils/pagination/get-sanitized-query-input-with-default-pagination-settings';
import { BlogSortFieldQueryInputDTO } from '../input-dto/query/blog-sort-field-query.input-dto';

/*Функция-обработчик для GET-запросов по получению блогов, используя query-параметры.*/
export const getBlogListHandler = async (
  req: Request<{}, {}, {}, GetBlogListQueryInputDTO>,
  res: Response<PaginatedBlogListOutputDTO>
) => {
  try {
    /*Санитизируем query-параметры и добавляем к ним дефолтные настройки пагинации.*/
    const sanitizedQueryInputWithDefaultPaginationSettings = getSanitizedQueryInputWithDefaultPaginationSettings<
      GetBlogListQueryInputDTO,
      BlogSortFieldQueryInputDTO
    >(req);

    /*Просим query-сервис "blogsQueryService" найти блоги.*/
    const paginatedBlogListResult: Result<{ paginatedBlogListOutput: PaginatedBlogListOutputDTO }> =
      await blogsQueryService.findAll(sanitizedQueryInputWithDefaultPaginationSettings);

    /*Получаем HTTP-статус операции по поиску блогов.*/
    const paginatedBlogListResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(paginatedBlogListResult.status);
    /*Отправляем блоги клиенту.*/
    res.status(paginatedBlogListResultHttpStatus).send(paginatedBlogListResult.data.paginatedBlogListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
