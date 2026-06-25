import { PaginatedPostListOutputDTO } from '../../routes/output-dto/paginated-post-list.output-dto';
import { PostOutputDTO } from '../../routes/output-dto/post.output-dto';
import { PostDBType } from '../types/post-db.type';

/*Функция для преобразования постов из БД в подготовленные для пагинации посты.*/
export const mapToPaginatedPostListOutputDTO = (
  posts: PostDBType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedPostListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: posts.map(
      (post): PostOutputDTO => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })
    ),
  };
};
