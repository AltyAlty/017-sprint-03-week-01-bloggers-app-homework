import { DefaultPaginationSettingsType } from '../../../../core/types/pagination/default-pagination-settings.type';
import { PostSortFieldQueryInputDTO } from './post-sort-field-query.input-dto';

/*Input DTO для query-параметров при получении постов.*/
export type GetPostListQueryInputDTO = DefaultPaginationSettingsType<PostSortFieldQueryInputDTO>;
