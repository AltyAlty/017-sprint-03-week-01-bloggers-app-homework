import { SecurityDeviceType } from '../application/types/security-device.type';
import { db } from '../../db/mongodb/mongo.db';
import { InsertOneResult, UpdateResult } from 'mongodb';
import { SecurityDeviceDBType } from './types/security-device-db.type';

/*Репозиторий для работы с устройствами пользователей в БД.*/
export const securityDevicesRepository = {
  /*Метод для добавления устройства пользователя в БД.*/
  async create(securityDevice: SecurityDeviceType): Promise<string> {
    /*Просим коллекцию "securityDevicesCollection" создать устройство пользователя в БД.*/
    const insertResult: InsertOneResult<SecurityDeviceType> = await db.securityDevicesCollection.insertOne({
      ...securityDevice,
    });

    /*Возвращаем ID созданного устройства пользователя.*/
    return insertResult.insertedId.toString();
  },

  /*Метод для поиска устройства пользователя по ID в БД.*/
  async findById(id: string): Promise<SecurityDeviceDBType | null> {
    /*Просим коллекцию "securityDevicesCollection" найти устройство пользователя по ID в БД.*/
    const securityDevice: SecurityDeviceDBType | null = await db.securityDevicesCollection.findOne({ deviceId: id });
    /*Если устройство пользователя не было найдено, то возвращаем null.*/
    if (!securityDevice) return null;
    /*Если устройство пользователя было найдено, то возвращаем его.*/
    return securityDevice;
  },

  /*Метод для изменения устройства пользователя по ID в БД.*/
  async updateById(id: string, ip: string, lastActiveDate: Date): Promise<number> {
    /*Просим коллекцию "securityDevicesCollection" изменить устройство пользователя по ID в БД.*/
    const updateResult: UpdateResult<SecurityDeviceType> = await db.securityDevicesCollection.updateOne(
      { deviceId: id },
      { $set: { ip, lastActiveDate } }
    );

    /*Возвращаем количество измененных устройств пользователя.*/
    return updateResult.matchedCount;
  },
};
