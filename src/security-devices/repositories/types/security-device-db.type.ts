import { WithId } from 'mongodb';
import { SecurityDeviceType } from '../../application/types/security-device.type';

/*Тип для устройства пользователя из сессии в БД.*/
export type SecurityDeviceDBType = WithId<SecurityDeviceType>;
