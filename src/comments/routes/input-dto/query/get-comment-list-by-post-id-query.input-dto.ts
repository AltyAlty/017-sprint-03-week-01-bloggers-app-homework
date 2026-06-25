import { DefaultPaginationSettingsType } from '../../../../core/types/pagination/default-pagination-settings.type';
import { CommentSortFieldQueryInputDTO } from './comment-sort-field-query.input-dto';

/*Input DTO для query-параметров при получении комментариев по ID поста.*/
export type GetCommentListByPostIdQueryInputDTO = DefaultPaginationSettingsType<CommentSortFieldQueryInputDTO>;
