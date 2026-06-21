import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../../core/settings/settings';
import { BlogType } from '../../blogs/application/types/blog.type';
import { PostType } from '../../posts/application/types/post.type';
import { UserType } from '../../users/application/types/user.type';
import { CommentType } from '../../comments/application/types/comment.type';
import { RefreshTokenType } from '../../auth/application/types/refresh-token.type';

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
  refreshTokensCollection: {} as Collection<RefreshTokenType>,

  /*Метод "runDB()" для подключения к серверу MongoDB.*/
  async runDb(url: string, dbName: string) {
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
      this.refreshTokensCollection = this.db.collection<RefreshTokenType>(SETTINGS.REFRESH_TOKENS_COLLECTION_NAME);
      /*Добавляем TTL в размере 7 дней для RT в БД.*/
      await this.refreshTokensCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: SETTINGS.RT_TTL });
      /*Присоединяем клиента для MongoDB к серверу и проверяем соединение.*/
      await this.client.connect();
      await this.db.command({ ping: 1 });
      console.log('✅ Successfully connected to a MongoDB server');
    } catch (error: unknown) {
      await this.client.close();
      throw new Error(`❌ Cannot connect to a MongoDB server: ${error}`);
    }
  },

  /*Метод "stopDb()" для отключения от сервера MongoDB.*/
  async stopDb() {
    if (!this.client) throw new Error(`❌ No MongoDB clients`);
    await this.client.close();
    console.log('✅ Connection successfully closed');
  },

  /*Метод "dropDb()" для очистки коллекций в БД.*/
  async dropDb() {
    try {
      /*Очищаем коллекции.*/
      await Promise.all([
        this.blogsCollection.deleteMany(),
        this.postsCollection.deleteMany(),
        this.commentsCollection.deleteMany(),
        this.usersCollection.deleteMany(),
        this.refreshTokensCollection.deleteMany(),
      ]);
    } catch (error: unknown) {
      console.error(`❌ Error while dropping DB: ${error}`);
      await this.stopDb();
    }
  },
};
