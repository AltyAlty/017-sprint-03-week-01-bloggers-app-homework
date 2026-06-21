import { WithId } from 'mongodb';
import { CommentType } from '../../application/types/comment.type';

/*Тип для комментария в БД.*/
export type CommentDBType = WithId<CommentType>;
