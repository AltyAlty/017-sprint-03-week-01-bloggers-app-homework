import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { db } from '../../db/mongodb/mongo.db';
import { EmailConfirmationType, UserType } from '../application/types/user.type';
import { UserDBType } from './types/user-db.type';

/*Репозиторий для работы с пользователями в БД.*/
export const usersRepository = {
  /*Метод для добавления пользователя в БД.*/
  async create(newUser: UserType): Promise<string> {
    /*Просим коллекцию "usersCollection" создать пользователя в БД.*/
    const insertResult: InsertOneResult<UserType> = await db.usersCollection.insertOne(newUser);
    /*Возвращаем ID созданного пользователя.*/
    return insertResult.insertedId.toString();
  },

  /*Метод для поиска пользователя по ID в БД.*/
  async findById(id: string): Promise<UserDBType | null> {
    /*Просим коллекцию "usersCollection" найти пользователя по ID в БД.*/
    const user: UserDBType | null = await db.usersCollection.findOne({ _id: new ObjectId(id) });
    /*Если пользователь не был найден, то возвращаем null.*/
    if (!user) return null;
    /*Если пользователь был найден, то возвращаем его.*/
    return user;
  },

  /*Метод для поиска пользователя по email в БД.*/
  async findByEmail(email: string): Promise<UserDBType | null> {
    /*Просим коллекцию "usersCollection" найти пользователя по email в БД.*/
    const user: UserDBType | null = await db.usersCollection.findOne({ email });
    /*Если пользователь не был найден, то возвращаем null.*/
    if (!user) return null;
    /*Если пользователь был найден, то возвращаем его.*/
    return user;
  },

  /*Метод для поиска пользователя по логину/email в БД.*/
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    /*Просим коллекцию "usersCollection" найти пользователя по логину/email в БД.*/
    const user: UserDBType | null = await db.usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    /*Если пользователь не был найден, то возвращаем null.*/
    if (!user) return null;
    /*Если пользователь был найден, то возвращаем его.*/
    return user;
  },

  /*Метод для поиска пользователя по коду подтверждения в БД.*/
  async findByConfirmationCode(code: string): Promise<UserDBType | null> {
    /*Просим коллекцию "usersCollection" найти пользователя по коду подтверждения в БД.*/
    const user: UserDBType | null = await db.usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    /*Если пользователь не был найден, то возвращаем null.*/
    if (!user) return null;
    /*Если пользователь был найден, то возвращаем его.*/
    return user;
  },

  /*Метод для подтверждения регистрации пользователя по коду в БД.*/
  async confirmByCode(code: string): Promise<number> {
    /*Просим коллекцию "usersCollection" подтвердить регистрацию пользователя по коду в БД.*/
    const updateResult: UpdateResult = await db.usersCollection.updateOne(
      { 'emailConfirmation.confirmationCode': code },
      { $set: { 'emailConfirmation.isConfirmed': true } }
    );

    /*Возвращаем количество пользователей, попавших под фильтр.*/
    return updateResult.matchedCount;
  },

  /*Метод для изменения данных для подтверждения регистрации пользователя по email в БД.*/
  async updateEmailConfirmationByEmail(email: string, emailConfirmation: EmailConfirmationType): Promise<number> {
    /*Просим коллекцию "usersCollection" изменить данные для подтверждения регистрации пользователя по email в БД.*/
    const updateResult: UpdateResult = await db.usersCollection.updateOne({ email }, { $set: { emailConfirmation } });
    /*Возвращаем количество пользователей, попавших под фильтр.*/
    return updateResult.matchedCount;
  },

  /*Метод для удаления пользователя по ID в БД.*/
  async deleteById(id: string): Promise<number> {
    /*Просим коллекцию "usersCollection" удалить пользователя по ID в БД.*/
    const deleteResult: DeleteResult = await db.usersCollection.deleteOne({ _id: new ObjectId(id) });
    /*Возвращаем количество удаленных пользователей.*/
    return deleteResult.deletedCount;
  },
};
