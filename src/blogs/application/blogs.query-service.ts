import { GetBlogListQueryInputDTO } from '../routes/input-dto/query/get-blog-list-query.input-dto';
import { blogsQueryRepository } from '../repositories/blogs.query-repository';
import { mapToPaginatedBlogListOutputDTO } from '../repositories/mappers/map-to-paginated-blog-list-output-dto.util';
import { PaginatedBlogListOutputDTO } from '../routes/output-dto/paginated-blog-list.output-dto';
import { mapToBlogOutputDTO } from '../repositories/mappers/map-to-blog-output-dto.util';
import { BlogOutputDTO } from '../routes/output-dto/blog.output-dto';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { Result } from '../../core/types/result/result.type';
import { BlogDBType } from '../repositories/types/blog-db.type';

/*Query-сервис для работы с блогами.*/
export const blogsQueryService = {
  /*Метод для поиска блога по ID.*/
  async findById(id: string): Promise<Result<{ blogOutput: BlogOutputDTO } | null>> {
    /*Просим query-репозиторий "blogsQueryRepository" найти блог по ID в БД.*/
    const blogDB: BlogDBType | null = await blogsQueryRepository.findById(id);

    /*Если блог не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!blogDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Blog not found' }],
      };
    }

    /*Если блог был найден, то преобразовываем блог из БД в подготовленный для отправки клиенту блог.*/
    const blogOutput: BlogOutputDTO = mapToBlogOutputDTO(blogDB);

    /*Возвращаем ResultObject с преобразованным блогом.*/
    return {
      status: ResultStatuses.Ok,
      data: { blogOutput },
      extensions: [],
    };
  },

  /*Метод для поиска блогов.*/
  async findAll(
    queryDTO: GetBlogListQueryInputDTO
  ): Promise<Result<{ paginatedBlogListOutput: PaginatedBlogListOutputDTO }>> {
    /*Просим query-репозиторий "blogsQueryRepository" найти блоги в БД.*/
    const { items, totalCount }: { items: BlogDBType[]; totalCount: number } =
      await blogsQueryRepository.findAll(queryDTO);

    /*Преобразовываем блоги из БД в подготовленные для пагинации блоги.*/
    const paginatedBlogListOutput: PaginatedBlogListOutputDTO = mapToPaginatedBlogListOutputDTO(items, {
      pageNumber: queryDTO.pageNumber,
      pageSize: queryDTO.pageSize,
      totalCount,
    });

    /*Возвращаем ResultObject с преобразованными для пагинации блогами.*/
    return {
      status: ResultStatuses.Ok,
      data: { paginatedBlogListOutput },
      extensions: [],
    };
  },
};
