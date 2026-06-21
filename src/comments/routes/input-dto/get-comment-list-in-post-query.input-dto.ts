import { DefaultPaginationSettingsType } from '../../../core/types/pagination/default-pagination-settings.type';
import { CommentSortFieldInputDTO } from './comment-sort-field.input-dto';

/*Input DTO для получения комментариев в посте.*/
export type GetCommentListInPostQueryInputDTO = DefaultPaginationSettingsType<CommentSortFieldInputDTO>;
