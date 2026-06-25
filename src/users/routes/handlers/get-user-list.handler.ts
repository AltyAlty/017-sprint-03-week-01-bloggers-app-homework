import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { GetUserListQueryInputDTO } from '../input-dto/query/get-user-list-query.input-dto';
import { usersQueryService } from '../../application/users.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { PaginatedUserListOutputDTO } from '../output-dto/paginated-user-list.output-dto';
import { Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { getSanitizedQueryInputWithDefaultPaginationSettings } from '../../../core/utils/pagination/get-sanitized-query-input-with-default-pagination-settings';
import { UserSortFieldQueryInputDTO } from '../input-dto/query/user-sort-field-query.input-dto';

/*Функция-обработчик для GET-запросов по получению пользователей с пагинацией, используя query-параметры.*/
export const getUserListHandler = async (
  req: Request<{}, {}, {}, GetUserListQueryInputDTO>,
  res: Response<PaginatedUserListOutputDTO>
) => {
  try {
    /*Санитизируем query-параметры и добавляем к ним дефолтные настройки пагинации.*/
    const sanitizedQueryInputWithDefaultPaginationSettings = getSanitizedQueryInputWithDefaultPaginationSettings<
      GetUserListQueryInputDTO,
      UserSortFieldQueryInputDTO
    >(req);

    /*Просим query-сервис "usersQueryService" найти пользователей.*/
    const paginatedUserListResult: Result<{ paginatedUserListOutput: PaginatedUserListOutputDTO }> =
      await usersQueryService.findAll(sanitizedQueryInputWithDefaultPaginationSettings);

    /*Получаем HTTP-статус операции по поиску пользователей.*/
    const paginatedUserListResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(paginatedUserListResult.status);
    /*Отправляем пользователей клиенту.*/
    res.status(paginatedUserListResultHttpStatus).send(paginatedUserListResult.data.paginatedUserListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
