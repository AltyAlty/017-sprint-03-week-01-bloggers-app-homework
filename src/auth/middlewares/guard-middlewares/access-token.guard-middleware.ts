import { NextFunction, Request, Response } from 'express';
import { jwtAdapter } from '../../adapters/jwt.adapter';
import { IdType } from '../../../core/types/id.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { SETTINGS } from '../../../core/settings/settings';
import { usersQueryRepository } from '../../../users/repositories/users.query-repository';

/*Middleware для проверки AT в запросах.*/
export const accessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  /*Получаем имя устройства пользователя из запроса.*/
  const deviceName: string | undefined = req.headers['user-agent'];
  /*Если имя устройства пользователя не было найдено, то сообщаем об отказе в аутентификации клиенту.*/
  if (!deviceName || deviceName.trim() === '') return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если имя устройства пользователя было найдено, то получаем IP-адрес пользователя из запроса.*/
  const ip: string | undefined = req.ip || req.socket.remoteAddress;
  /*Если IP-адрес пользователя не был найден, то сообщаем об отказе в аутентификации клиенту.*/
  if (!ip) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если IP-адрес пользователя был найден, то получаем значение заголовка "authorization" их запроса.*/
  const authorizationHeader: string | undefined = req.headers['authorization'];
  /*Если в заголовках запроса нет заголовка "authorization", то сообщаем об отказе в аутентификации клиенту.*/
  if (!authorizationHeader) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если в заголовках запроса есть заголовок "authorization", то получаем из него тип авторизации и AT.*/
  const [authType, token]: string[] = authorizationHeader.split(' ');
  /*Если тип авторизации не "Bearer", то сообщаем об отказе в аутентификации клиенту.*/
  if (authType !== 'Bearer') return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если тип авторизации "Bearer", то просим адаптер "jwtAdapter" верифицировать AT.*/
  const payload: { userId: string } | null = await jwtAdapter.verifyAccessToken(token, SETTINGS.AT_SECRET!);
  /*Если верификация AT не прошла успешно, то сообщаем об отказе в аутентификации клиенту.*/
  if (!payload) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если верификация AT прошла успешно, то получаем ID пользователя из AT.*/
  const userIdFromAT: string = payload.userId as string;
  /*Просим репозиторий "usersRepository" найти пользователя по ID в БД.*/
  const userDB = await usersQueryRepository.findById(userIdFromAT);
  /*Если пользователь не был найден, то сообщаем об отказе в аутентификации клиенту.*/
  if (!userDB) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если пользователь был найден, то прикрепляем ID пользователя к запросу.*/
  req.userId = { id: userIdFromAT } as IdType;
  /*Разрешаем дальнейшее выполнение запроса при помощи функции "next()".*/
  next();
};
