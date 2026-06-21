import { RefreshTokenType } from '../../application/types/refresh-token.type';
import { WithId } from 'mongodb';

/*Тип для RT в БД.*/
export type RefreshTokenDBType = WithId<RefreshTokenType>;
