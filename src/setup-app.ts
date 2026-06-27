import express, { Express, Request, Response } from 'express';
import { HttpStatuses } from './core/types/http-statuses';
import { setupSwagger } from './core/swagger/setup-swagger';
import { SETTINGS } from './core/settings/settings';
import { blogsRouter } from './blogs/routes/blogs.router';
import { postsRouter } from './posts/routes/posts.router';
import { testingRouter } from './testing/routes/testing.router';
import { usersRouter } from './users/routes/users.router';
import { authRouter } from './auth/routes/auth.router';
import { commentsRouter } from './comments/routes/comments.router';
import cookieParser from 'cookie-parser';
import { securityDevicesRouter } from './security-devices/routes/security-devices.router';

/*Функция для конфигурирования экземпляров приложения Express.*/
export const setupApp = async (app: Express): Promise<Express> => {
  /*Подключаем middleware для парсинга JSON в теле запроса.*/
  app.use(express.json());
  /*Подключаем middleware для работы с cookies.*/
  app.use(cookieParser());
  /*Просим Express.js доверять заголовкам от прокси, чтобы правильно определять реальный IP пользователя и протокол
  вместо того, чтобы видеть IP самого прокси-сервера.*/
  app.set('trust proxy', true);
  /*GET-запрос по получению главной страницы.*/
  app.get('/', (req: Request, res: Response) => res.status(HttpStatuses.Ok_200).send('Hello World!'));
  /*Подключаем роутеры.*/
  app.use(SETTINGS.BLOGS_PATH, blogsRouter);
  app.use(SETTINGS.POSTS_PATH, postsRouter);
  app.use(SETTINGS.COMMENTS_PATH, commentsRouter);
  app.use(SETTINGS.USERS_PATH, usersRouter);
  app.use(SETTINGS.AUTH_PATH, authRouter);
  app.use(SETTINGS.SECURITY_DEVICES_PATH, securityDevicesRouter);
  app.use(SETTINGS.TESTING_PATH, testingRouter);
  /*Инициализируем документацию Swagger.*/
  setupSwagger(app);
  return app;
};
