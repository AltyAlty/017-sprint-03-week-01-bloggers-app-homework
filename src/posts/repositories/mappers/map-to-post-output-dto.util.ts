import { PostOutputDTO } from '../../routes/output-dto/post.output-dto';
import { PostDBType } from '../types/post-db.type';

/*Функция для преобразования поста из БД в подготовленный для отправки клиенту пост.*/
export const mapToPostOutputDTO = (post: PostDBType): PostOutputDTO => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
