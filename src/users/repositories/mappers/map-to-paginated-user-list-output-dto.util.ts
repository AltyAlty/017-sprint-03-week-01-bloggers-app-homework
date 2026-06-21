import { UserOutputDTO } from '../../routes/output-dto/user.output-dto';
import { PaginatedUserListOutputDTO } from '../../routes/output-dto/paginated-user-list.output-dto';
import { UserDBType } from '../types/user-db.type';

/*Функция "mapToPaginatedUserListOutputDTO()" преобразовывает пользователей из БД в подготовленные для пагинации
пользователей.*/
export const mapToPaginatedUserListOutputDTO = (
  users: UserDBType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedUserListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: users.map(
      (user): UserOutputDTO => ({
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      })
    ),
  };
};
