import { WithId } from 'mongodb';
import { BlogType } from '../../application/types/blog.type';

/*Тип для блога в БД.*/
export type BlogDBType = WithId<BlogType>;
