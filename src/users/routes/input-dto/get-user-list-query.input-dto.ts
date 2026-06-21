import { DefaultPaginationSettingsType } from '../../../core/types/pagination/default-pagination-settings.type';
import { UserSortFieldInputDTO } from './user-sort-field.input-dto';

/*Input DTO для query-параметров при получении пользователей.*/
export type GetUserListQueryInputDTO = DefaultPaginationSettingsType<UserSortFieldInputDTO> &
  Partial<{ searchLoginTerm: string; searchEmailTerm: string }>;
