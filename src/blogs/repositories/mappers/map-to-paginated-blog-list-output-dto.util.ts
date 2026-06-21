import { PaginatedBlogListOutputDTO } from '../../routes/output-dto/paginated-blog-list.output-dto';
import { BlogOutputDTO } from '../../routes/output-dto/blog.output-dto';
import { BlogDBType } from '../types/blog-db.type';

/*Функция "mapToPaginatedBlogListOutputDTO()" преобразовывает блоги из БД в подготовленные для пагинации блоги.*/
export const mapToPaginatedBlogListOutputDTO = (
  blogs: BlogDBType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedBlogListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: blogs.map(
      (blog): BlogOutputDTO => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      })
    ),
  };
};
