import { WithId } from 'mongodb';
import { PostType } from '../../application/types/post.type';

/*Тип для поста в БД.*/
export type PostDBType = WithId<PostType>;
