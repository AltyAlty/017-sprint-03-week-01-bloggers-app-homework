import { SessionType } from '../../application/types/session.type';
import { WithId } from 'mongodb';

/*Тип для сессии в БД.*/
export type SessionDBType = WithId<SessionType>;
