import { SecurityDeviceDBType } from './types/security-device-db.type';
import { db } from '../../db/mongodb/mongo.db';

/*Query-репозиторий для работы с устройствами пользователей в БД.*/
export const securityDevicesQueryRepository = {
  /*Метод для поиска устройств пользователя по ID устройств пользователя в БД.*/
  async findAllByIds(ids: string[]): Promise<SecurityDeviceDBType[] | null> {
    /*Просим коллекцию "securityDevicesCollection" найти устройства пользователя по ID устройств пользователя в БД.*/
    const securityDevices: SecurityDeviceDBType[] = await db.securityDevicesCollection
      .find({ deviceId: { $in: ids } })
      .toArray();

    /*Если устройства пользователя не были найдены, то возвращаем null.*/
    if (!securityDevices || securityDevices.length === 0) return null;
    /*Если устройства пользователя были найдены, то возвращаем их.*/
    return securityDevices;
  },
};
