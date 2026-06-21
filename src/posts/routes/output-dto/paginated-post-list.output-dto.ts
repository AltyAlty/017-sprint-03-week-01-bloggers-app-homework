import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';
import { PostOutputDTO } from './post.output-dto';

/*Output DTO для постов с пагинацией: содержит метаданные пагинации и массив элементов постов.*/
export type PaginatedPostListOutputDTO = PaginationMetaDataOutputDTO & { items: PostOutputDTO[] };
