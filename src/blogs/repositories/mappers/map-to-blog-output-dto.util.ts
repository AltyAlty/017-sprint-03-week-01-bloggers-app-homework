import { BlogOutputDTO } from '../../routes/output-dto/blog.output-dto';
import { BlogDBType } from '../types/blog-db.type';

/*Функция "mapToBlogOutputDTO()" преобразовывает блог из БД в подготовленный для отправки клиенту блог.*/
export const mapToBlogOutputDTO = (blog: BlogDBType): BlogOutputDTO => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
