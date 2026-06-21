import { WithId } from 'mongodb';
import { UserType } from '../../application/types/user.type';

/*Тип для пользователя в БД.*/
export type UserDBType = WithId<UserType>;
