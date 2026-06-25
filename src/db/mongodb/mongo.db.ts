import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../../core/settings/settings';
import { BlogType } from '../../blogs/application/types/blog.type';
import { PostType } from '../../posts/application/types/post.type';
import { UserType } from '../../users/application/types/user.type';
import { CommentType } from '../../comments/application/types/comment.type';
import { SessionType } from '../../auth/application/types/session.type';
import { SecurityDeviceType } from '../../security-devices/application/types/security-device.type';
import { RequestRateLimitLogType } from '../../auth/application/types/request-rate-limit-log.type';

/*Объект для работы с MongoDB.*/
export const db = {
  /*Клиент для MongoDB.*/
  client: {} as MongoClient,

  /*БД для подключения клиента для MongoDB.*/
  db: {} as Db,

  /*Коллекции.*/
  blogsCollection: {} as Collection<BlogType>,
  postsCollection: {} as Collection<PostType>,
  commentsCollection: {} as Collection<CommentType>,
  usersCollection: {} as Collection<UserType>,
  sessionsCollection: {} as Collection<SessionType>,
  securityDevicesCollection: {} as Collection<SecurityDeviceType>,
  requestRateLimitLogsCollection: {} as Collection<RequestRateLimitLogType>,

  /*Метод для подключения к серверу MongoDB.*/
  async runDB(url: string, dbName: string) {
    try {
      /*Создаем клиент для MongoDB.*/
      this.client = new MongoClient(url);
      /*Указываем БД, к которой будет подключаться клиент для MongoDB.*/
      this.db = this.client.db(dbName);
      /*Создаем коллекции в указанной БД.*/
      this.blogsCollection = this.db.collection<BlogType>(SETTINGS.BLOGS_COLLECTION_NAME);
      this.postsCollection = this.db.collection<PostType>(SETTINGS.POSTS_COLLECTION_NAME);
      this.commentsCollection = this.db.collection<CommentType>(SETTINGS.COMMENTS_COLLECTION_NAME);
      this.usersCollection = this.db.collection<UserType>(SETTINGS.USERS_COLLECTION_NAME);
      this.sessionsCollection = this.db.collection<SessionType>(SETTINGS.SESSIONS_COLLECTION_NAME);
      await this.sessionsCollection.createIndex({ exp: 1 }, { expireAfterSeconds: 0 });

      this.securityDevicesCollection = this.db.collection<SecurityDeviceType>(
        SETTINGS.SECURITY_DEVICES_COLLECTION_NAME
      );

      this.requestRateLimitLogsCollection = this.db.collection<RequestRateLimitLogType>(
        SETTINGS.REQUEST_RATE_LIMIT_LOGS_COLLECTION_NAME
      );

      await this.requestRateLimitLogsCollection.createIndex(
        { timestamp: 1 },
        { expireAfterSeconds: SETTINGS.REQUEST_RATE_LIMIT_LOG_EXPIRATION_TIME_IN_SECONDS }
      );

      /*Используем составной индекс, чтобы ускорить работу метода "countDocuments()".*/
      await this.requestRateLimitLogsCollection.createIndex({ ip: 1, url: 1, timestamp: -1 });

      /*Присоединяем клиента для MongoDB к серверу и проверяем соединение.*/
      await this.client.connect();
      await this.db.command({ ping: 1 });
      console.log('✅ Successfully connected to a MongoDB server');
    } catch (error: unknown) {
      await this.client.close();
      throw new Error(`❌ Cannot connect to a MongoDB server: ${error}`);
    }
  },

  /*Метод для отключения от сервера MongoDB.*/
  async stopDB() {
    if (!this.client) throw new Error(`❌ No MongoDB clients`);
    await this.client.close();
    console.log('✅ Connection successfully closed');
  },

  /*Метод для очистки коллекций в БД.*/
  async dropDB() {
    try {
      /*Очищаем коллекции.*/
      await Promise.all([
        this.blogsCollection.deleteMany(),
        this.postsCollection.deleteMany(),
        this.commentsCollection.deleteMany(),
        this.usersCollection.deleteMany(),
        this.sessionsCollection.deleteMany(),
        this.securityDevicesCollection.deleteMany(),
        this.requestRateLimitLogsCollection.deleteMany(),
      ]);
    } catch (error: unknown) {
      console.error(`❌ Error while dropping DB: ${error}`);
      await this.stopDB();
    }
  },
};
