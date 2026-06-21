import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { db } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { clearDb } from '../db/clear-db.test-util';
import { MongoMemoryServer } from 'mongodb-memory-server';

/*Функция "doBeforeTests()" для предварительных действий перед запуском тестов.*/
export const doBeforeTests = () => {
  /*Создаем экземпляр приложения Express.*/
  const app = express();
  /*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
  setupApp(app);

  /*Указываем, что перед запуском тестового набора будет запускаться и очищаться БД.*/
  beforeAll(async () => {
    await db.runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  /*Указываем, что перед запуском каждого теста будет очищаться БД.*/
  beforeEach(async () => await clearDb(app));

  /*Указываем, что после того как тестовый набор отработает, будет очищать и отключаться от БД.*/
  afterAll(async () => {
    await clearDb(app);
    await db.stopDb();
  });

  /*Возвращаем настроенный экземпляр приложения Express.*/
  return app;
};

/*Функция "doBeforeTestsWithMongoMemoryServer()" для предварительных действий перед запуском тестов, используя моковый
сервер.*/
export const doBeforeTestsWithMongoMemoryServer = () => {
  /*Создаем экземпляр приложения Express.*/
  const app = express();
  /*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
  setupApp(app);
  /*Используем моковый сервер.*/
  let mongoServer: MongoMemoryServer;

  /*Указываем, что перед запуском тестового набора будет запускаться и очищаться БД.*/
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await db.runDb(mongoServer.getUri(), SETTINGS.TEST_DB_NAME);
    await db.dropDb();
  });

  /*Указываем, что перед запуском каждого теста будет очищаться БД.*/
  beforeEach(async () => await clearDb(app));

  /*Указываем, что после того как тестовый набор отработает, будет очищать и отключаться от БД.*/
  afterAll(async () => {
    await db.dropDb();
    await db.stopDb();
    if (mongoServer) await mongoServer.stop();
  });

  /*Возвращаем настроенный экземпляр приложения Express.*/
  return app;
};
