import { DefaultPaginationSettingsType } from '../../../core/types/pagination/default-pagination-settings.type';
import { PostSortFieldInputDTO } from './post-sort-field.input-dto';

/*Input DTO для query-параметров при получении постов.*/
export type GetPostListQueryInputDTO = DefaultPaginationSettingsType<PostSortFieldInputDTO>;
