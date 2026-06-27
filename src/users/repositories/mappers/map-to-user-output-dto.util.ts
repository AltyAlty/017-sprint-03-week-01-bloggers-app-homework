import { UserOutputDTO } from '../../routes/output-dto/user.output-dto';
import { UserDBType } from '../types/user-db.type';

/*Функция для преобразования пользователя из БД в подготовленного для отправки клиенту пользователя.*/
export const mapToUserOutputDTO = (user: UserDBType): UserOutputDTO => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
