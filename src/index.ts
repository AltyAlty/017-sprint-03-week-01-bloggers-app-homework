import 'dotenv/config';
import express, { Express } from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './core/settings/settings';
import { db } from './db/mongodb/mongo.db';

/*Функция для запуска приложения.*/
const bootstrap = async () => {
  /*Создаем экземпляр приложения Express.*/
  const app: Express = express();
  /*Настраиваем экземпляр приложения Express.*/
  await setupApp(app);
  /*Указываем порт для экземпляра приложения Express.*/
  const PORT: string | number = SETTINGS.PORT || 5001;
  /*Подключаемся к серверу MongoDB.*/
  await db.runDB(SETTINGS.MONGO_URL, SETTINGS.DB_NAME);
  /*Запускаем экземпляр приложения Express.*/
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
  return app;
};

/*Запускаем приложение.*/
bootstrap();
