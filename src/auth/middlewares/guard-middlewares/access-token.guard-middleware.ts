import { NextFunction, Request, Response } from 'express';
import { jwtAdapter } from '../../adapters/jwt.adapter';
import { IdType } from '../../../core/types/id.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { SETTINGS } from '../../../core/settings/settings';

/*Middleware для проверки AT в запросах.*/
export const accessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  /*Если в заголовках запроса нет заголовка "authorization", то сообщаем об отказе в аутентификации клиенту.*/
  if (!req.headers.authorization) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если в заголовках запроса есть заголовок "authorization", то получаем из него тип авторизации и токен.*/
  const [authType, token]: string[] = req.headers.authorization.split(' ');
  /*Если тип авторизации не "Bearer", то сообщаем об отказе в аутентификации клиенту.*/
  if (authType !== 'Bearer') return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если тип авторизации "Bearer", то просим адаптер "jwtAdapter" верифицировать токен.*/
  const payload: { userId: string } | null = await jwtAdapter.verifyAccessToken(token, SETTINGS.AT_SECRET!);

  /*Если верификация токена прошла успешно, то извлекаем ID пользователя и прикрепляем его к запросу. После чего
  разрешаем дальнейшее выполнение запроса при помощи функции "next()".*/
  if (payload) {
    const { userId }: { userId: string } = payload;
    req.userId = { id: userId } as IdType;
    next();
  }

  /*Если верификация токена не прошла успешно, то сообщаем об отказе в аутентификации клиенту.*/
  return res.sendStatus(HttpStatuses.Unauthorized_401);
};
