import { DefaultPaginationSettingsType } from '../../../../core/types/pagination/default-pagination-settings.type';
import { UserSortFieldQueryInputDTO } from './user-sort-field-query.input-dto';

/*Input DTO для query-параметров при получении пользователей.*/
export type GetUserListQueryInputDTO = DefaultPaginationSettingsType<UserSortFieldQueryInputDTO> &
  Partial<{ searchLoginTerm: string; searchEmailTerm: string }>;
