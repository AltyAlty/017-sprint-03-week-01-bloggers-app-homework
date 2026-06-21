import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';
import { CommentOutputDTO } from './comment.output-dto';

/*Output DTO для комментариев с пагинацией: содержит метаданные пагинации и массив элементов комментариев.*/
export type PaginatedCommentListOutputDTO = PaginationMetaDataOutputDTO & { items: CommentOutputDTO[] };
