import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';
import { UserOutputDTO } from './user.output-dto';

/*Output DTO для пользователей с пагинацией: содержит метаданные пагинации и массив элементов пользователей.*/
export type PaginatedUserListOutputDTO = PaginationMetaDataOutputDTO & { items: UserOutputDTO[] };
