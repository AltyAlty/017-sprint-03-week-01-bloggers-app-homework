import { NextFunction, Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { SETTINGS } from '../../../core/settings/settings';

/*Middleware "basicAuthGuardMiddleware" отвечает за базовую авторизацию в приложении.*/
export const basicAuthGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  /*Получаем заголовок "Authorization" из запроса. Должно быть вида "Basic <base64-encoded-credentials>".*/
  const auth: string = req.headers['authorization'] as string;

  /*Если получить заголовок "Authorization" не удалось, то сообщаем об отказе в авторизации клиенту.*/
  if (!auth) {
    res.sendStatus(HttpStatuses.Unauthorized_401);
    return;
  }

  /*Разбиваем строку по пробелу, получая тип авторизации ("Basic") и токен.*/
  const [authType, token]: string[] = auth.split(' ');

  /*Если тип авторизации не "Basic", то сообщаем об отказе в авторизации клиенту.*/
  if (authType !== 'Basic') {
    res.sendStatus(HttpStatuses.Unauthorized_401);
    return;
  }

  /*Расшифровываем токен из формата base64 в обычную строку.*/
  const credentials: string = Buffer.from(token, 'base64').toString('utf-8');
  /*Разделяем расшифрованный токен на логин и пароль.*/
  const [username, password]: string[] = credentials.split(':');

  /*Если логин и пароль не совпадают с заранее заданными значениями, то сообщаем об отказе в авторизации клиенту.*/
  if (username !== SETTINGS.BASIC_AUTH_ADMIN_USERNAME || password !== SETTINGS.BASIC_AUTH_ADMIN_PASSWORD) {
    res.sendStatus(HttpStatuses.Unauthorized_401);
    return;
  }

  /*Если логин и пароль совпадают с заранее заданными значениями, то разрешаем дальнейшее выполнение запроса при помощи
  функции "next()".*/
  next();
};
