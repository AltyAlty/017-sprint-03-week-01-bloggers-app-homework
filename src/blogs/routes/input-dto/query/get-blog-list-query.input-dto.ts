import { DefaultPaginationSettingsType } from '../../../../core/types/pagination/default-pagination-settings.type';
import { BlogSortFieldQueryInputDTO } from './blog-sort-field-query.input-dto';

/*Input DTO для query-параметров при получении блогов.

Касательно TS:
1. "DefaultPaginationSettingsType<BlogSortFieldInputDTO>": обязательная часть типа.
2. "Partial<...>": дополнительные необязательные поля типа.*/
export type GetBlogListQueryInputDTO = DefaultPaginationSettingsType<BlogSortFieldQueryInputDTO> &
  Partial<{ searchNameTerm: string }>;
