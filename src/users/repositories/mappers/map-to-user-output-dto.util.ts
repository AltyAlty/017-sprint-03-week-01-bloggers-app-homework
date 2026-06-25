import { UserOutputDTO } from '../../routes/output-dto/user.output-dto';
import { UserDBType } from '../types/user-db.type';

/*Функция для преобразования пользователя из БД в подготовленного для отправки клиенту пользователя.*/
export const mapToUserOutputDTO = (blog: UserDBType): UserOutputDTO => {
  return {
    id: blog._id.toString(),
    login: blog.login,
    email: blog.email,
    createdAt: blog.createdAt,
  };
};
