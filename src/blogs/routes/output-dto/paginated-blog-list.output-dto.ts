import { BlogOutputDTO } from './blog.output-dto';
import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';

/*Output DTO для блогов с пагинацией: содержит метаданные пагинации и массив элементов блогов.*/
export type PaginatedBlogListOutputDTO = PaginationMetaDataOutputDTO & { items: BlogOutputDTO[] };
