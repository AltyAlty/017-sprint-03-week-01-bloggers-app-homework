import { RefreshTokenType } from '../application/types/refresh-token.type';
import { InsertOneResult, UpdateResult } from 'mongodb';
import { db } from '../../db/mongodb/mongo.db';
import { RefreshTokenDBType } from './types/refresh-token-db.type';

/*Репозиторий "authRepository" для работы с аутентификацией в БД.*/
export const authRepository = {
  /*Метод "create()" для добавления RT в БД.*/
  async createRefreshToken(refreshToken: RefreshTokenType): Promise<string> {
    /*Просим коллекцию "refreshTokensCollection" создать RT в БД.*/
    const insertResult: InsertOneResult<RefreshTokenType> = await db.refreshTokensCollection.insertOne(refreshToken);
    /*Возвращаем ID созданного RT.*/
    return insertResult.insertedId.toString();
  },

  /*Метод "findRT()" для поиска RT в БД.*/
  async findRT(refreshToken: string): Promise<RefreshTokenDBType | null> {
    /*Просим коллекцию "refreshTokensCollection" найти RT в БД.*/
    const refreshTokenDB: RefreshTokenDBType | null = await db.refreshTokensCollection.findOne({ token: refreshToken });
    /*Если RT не был найден, то возвращаем null.*/
    if (!refreshTokenDB) return null;
    /*Если RT был найден, то возвращаем его.*/
    return refreshTokenDB;
  },

  /*Метод "blacklistRT()" для добавления RT в черный список в БД.*/
  async blacklistRT(refreshToken: string): Promise<number> {
    /*Просим коллекцию "refreshTokensCollection" добавить RT в черный список в БД.*/
    const updateResult: UpdateResult<RefreshTokenType> = await db.refreshTokensCollection.updateOne(
      { token: refreshToken },
      { $set: { blacklisted: true } }
    );

    /*Возвращаем количество измененных RT.*/
    return updateResult.matchedCount;
  },
};
