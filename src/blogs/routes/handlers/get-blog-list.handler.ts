import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { GetBlogListQueryInputDTO } from '../input-dto/get-blog-list-query.input-dto';
import { blogsQueryService } from '../../application/blogs.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { PaginatedBlogListOutputDTO } from '../output-dto/paginated-blog-list.output-dto';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { Result } from '../../../core/types/result/result.type';
import { getSanitizedQueryInputWithDefaultPaginationSettings } from '../../../core/utils/pagination/get-sanitized-query-input-with-default-pagination-settings';
import { BlogSortFieldInputDTO } from '../input-dto/blog-sort-field.input-dto';

/*Функция-обработчик "getBlogListHandler()" для GET-запросов по получению блогов, используя query-параметры.*/
export const getBlogListHandler = async (
  req: Request<{}, {}, {}, GetBlogListQueryInputDTO>,
  res: Response<PaginatedBlogListOutputDTO>
) => {
  try {
    /*Санитизируем query-параметры и добавляем к ним дефолтные настройки пагинации.*/
    const sanitizedQueryInputWithDefaultPaginationSettings = getSanitizedQueryInputWithDefaultPaginationSettings<
      GetBlogListQueryInputDTO,
      BlogSortFieldInputDTO
    >(req);

    /*Просим query-сервис "blogsQueryService" найти блоги.*/
    const paginatedBlogListResult: Result<{ paginatedBlogListOutput: PaginatedBlogListOutputDTO }> =
      await blogsQueryService.findMany(sanitizedQueryInputWithDefaultPaginationSettings);

    /*Получаем HTTP-статус операции по поиску блогов.*/
    const paginatedBlogListResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(paginatedBlogListResult.status);
    /*Отправляем блоги клиенту.*/
    res.status(paginatedBlogListResultHttpStatus).send(paginatedBlogListResult.data.paginatedBlogListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
