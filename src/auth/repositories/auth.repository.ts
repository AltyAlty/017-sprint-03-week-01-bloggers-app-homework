import { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb';
import { db } from '../../db/mongodb/mongo.db';
import { SessionType } from '../application/types/session.type';
import { SessionDBType } from './types/session-db.type';
import { RequestRateLimitLogType } from '../application/types/request-rate-limit-log.type';

/*Репозиторий для работы с аутентификацией и авторизацией в БД.*/
export const authRepository = {
  /*Метод для добавления сессии в БД.*/
  async createSession(
    userId: string,
    deviceId: string,
    deviceName: string,
    ip: string,
    iat: Date,
    exp: Date
  ): Promise<string> {
    /*Просим коллекцию "sessionsCollection" создать сессию в БД.*/
    const insertResult: InsertOneResult<SessionType> = await db.sessionsCollection.insertOne({
      userId,
      deviceId,
      deviceName,
      ip,
      iat,
      exp,
    });

    /*Возвращаем ID созданной сессии.*/
    return insertResult.insertedId.toString();
  },

  /*Метод для добавления записи в журнал лимитов запросов в БД.*/
  async createRequestRateLimitLog(requestRateLimitLog: RequestRateLimitLogType): Promise<string> {
    /*Просим коллекцию "requestRateLimitLogsCollection" создать запись в журнале лимитов запросов в БД.*/
    const insertResult: InsertOneResult<RequestRateLimitLogType> =
      await db.requestRateLimitLogsCollection.insertOne(requestRateLimitLog);

    /*Возвращаем ID созданной записи в журнале лимитов запросов.*/
    return insertResult.insertedId.toString();
  },

  /*Метод для подсчета количества записей в журнале лимитов запросов за указанный период по IP-адресу и URL в БД.*/
  async countRequestRateLimitLogsByIPAndUrl(ip: string, url: string, seconds: number): Promise<number> {
    /*Просим коллекцию "requestRateLimitLogsCollection" подсчитать количество записей в журнале лимитов запросов за
    указанный период по IP-адресу и URL в БД.*/
    return db.requestRateLimitLogsCollection.countDocuments({
      ip: ip,
      url: url,
      timestamp: { $gte: new Date(Date.now() - seconds * 1000) },
    });
  },

  /*Метод для поиска сессии по ID пользователя и ID устройства пользователя в БД.*/
  async findSessionByUserIdAndDeviceId(userId: string, deviceId: string): Promise<SessionDBType | null> {
    /*Просим коллекцию "sessionsCollection" найти сессию по ID устройства пользователя в БД.*/
    const session: SessionDBType | null = await db.sessionsCollection.findOne({ userId, deviceId });
    /*Если сессия не была найдена, то возвращаем null.*/
    if (!session) return null;
    /*Если сессия была найдена, то возвращаем ее.*/
    return session;
  },

  /*Метод для поиска сессии по ID пользователя, ID устройства пользователя и дате выдачи RT в БД.*/
  async findSessionByUserIdAndDeviceIdAndIat(
    userId: string,
    deviceId: string,
    iat: Date
  ): Promise<SessionDBType | null> {
    /*Просим коллекцию "sessionsCollection" найти сессию по дате выдачи RT в БД.*/
    const session: SessionDBType | null = await db.sessionsCollection.findOne({ userId, deviceId, iat });
    /*Если сессия не была найдена, то возвращаем null.*/
    if (!session) return null;
    /*Если сессия была найдена, то возвращаем ее.*/
    return session;
  },

  /*Метод для поиска сессий по ID пользователя в БД.*/
  async findAllSessionsByUserId(userId: string): Promise<SessionDBType[] | null> {
    /*Просим коллекцию "sessionsCollection" найти сессии по ID пользователя в БД.*/
    const sessions: SessionDBType[] = await db.sessionsCollection.find({ userId }).toArray();
    /*Если сессии не были найдены, то возвращаем null.*/
    if (!sessions || sessions.length === 0) return null;
    /*Если сессии были найдены, то возвращаем их.*/
    return sessions;
  },

  /*Метод для изменения сессии по дате создания RT в БД.*/
  async updateSessionByIAT(currentIAT: Date, iat: Date, exp: Date, ip: string): Promise<number> {
    /*Просим коллекцию "sessionsCollection" изменить сессию по дате создания RT в БД.*/
    const updateResult: UpdateResult<SessionType> = await db.sessionsCollection.updateOne(
      { iat: currentIAT },
      { $set: { iat, exp, ip } }
    );

    /*Возвращаем количество сессий, попавших под фильтр.*/
    return updateResult.matchedCount;
  },

  /*Метод для удаления сессии по дате создания RT в БД.*/
  async deleteSessionByIAT(iat: Date): Promise<number> {
    /*Просим коллекцию "sessionsCollection" удалить сессию по дате создания RT в БД.*/
    const deleteResult: DeleteResult = await db.sessionsCollection.deleteOne({ iat });
    /*Возвращаем количество удаленных сессий.*/
    return deleteResult.deletedCount;
  },

  /*Метод для удаления сессии по ID пользователя и ID устройства пользователя в БД.*/
  async deleteSessionByUserIdAndDeviceId(userId: string, deviceId: string): Promise<number> {
    /*Просим коллекцию "sessionsCollection" удалить сессию по ID устройства пользователя в БД.*/
    const deleteResult: DeleteResult = await db.sessionsCollection.deleteOne({ userId, deviceId });
    /*Возвращаем количество удаленных сессий.*/
    return deleteResult.deletedCount;
  },

  /*Метод для отзыва всех сессий пользователя, кроме текущей, в БД.*/
  async deleteSessionsExceptCurrentDevice(userId: string, deviceId: string): Promise<number> {
    /*Просим коллекцию "sessionsCollection" удалить все сессии пользователя, кроме текущей, в БД.*/
    const deleteResult: DeleteResult = await db.sessionsCollection.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });

    /*Возвращаем количество удаленных сессий.*/
    return deleteResult.deletedCount;
  },
};
