import { GetUserListQueryInputDTO } from '../routes/input-dto/get-user-list-query.input-dto';
import { usersQueryRepository } from '../repositories/users.query-repository';
import { mapToPaginatedUserListOutputDTO } from '../repositories/mappers/map-to-paginated-user-list-output-dto.util';
import { PaginatedUserListOutputDTO } from '../routes/output-dto/paginated-user-list.output-dto';
import { mapToUserOutputDTO } from '../repositories/mappers/map-to-user-output-dto.util';
import { UserOutputDTO } from '../routes/output-dto/user.output-dto';
import { Result } from '../../core/types/result/result.type';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { UserDBType } from '../repositories/types/user-db.type';

/*Query-сервис "usersQueryService" для работы с пользователями.*/
export const usersQueryService = {
  /*Метод "findById()" для поиска пользователя по ID.*/
  async findById(userId: string): Promise<Result<{ userOutput: UserOutputDTO } | null>> {
    /*Просим query-репозиторий "usersQueryRepository" найти пользователя по ID в БД.*/
    const userDB: UserDBType | null = await usersQueryRepository.findById(userId);

    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!userDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'userId', message: 'Not Found' }],
      };
    }

    /*Если пользователь был найден, то преобразовываем пользователя из БД в подготовленного для отправки пользователя.*/
    const userOutput: UserOutputDTO = mapToUserOutputDTO(userDB);

    /*Возвращаем ResultObject c преобразованным пользователем.*/
    return {
      status: ResultStatuses.Ok,
      data: { userOutput },
      extensions: [],
    };
  },

  /*Метод "findMany()" для поиска пользователей.*/
  async findMany(
    queryDTO: GetUserListQueryInputDTO
  ): Promise<Result<{ paginatedUserListOutput: PaginatedUserListOutputDTO }>> {
    /*Просим query-репозиторий "usersQueryRepository" найти пользователей в БД.*/
    const { items, totalCount }: { items: UserDBType[]; totalCount: number } =
      await usersQueryRepository.findMany(queryDTO);

    /*Преобразовываем пользователей из БД в подготовленных для пагинации пользователей.*/
    const paginatedUserListOutput: PaginatedUserListOutputDTO = mapToPaginatedUserListOutputDTO(items, {
      pageNumber: queryDTO.pageNumber,
      pageSize: queryDTO.pageSize,
      totalCount,
    });

    /*Возвращаем ResultObject c преобразованными пользователями.*/
    return {
      status: ResultStatuses.Ok,
      data: { paginatedUserListOutput },
      extensions: [],
    };
  },
};
