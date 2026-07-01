import { NextFunction, Request, Response } from 'express';
import { authRepository } from '../../repositories/auth.repository';
import { RequestRateLimitLogType } from '../../application/types/request-rate-limit-log.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { SETTINGS } from '../../../core/settings/settings';

/*Middleware для лимитирования запросов.*/
export const requestRateLimitGuardMiddleware = async (
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
  /*Если IP-адрес пользователя был найден, то получаем URL, по которому был сделан запрос.*/
  const url: string = req.originalUrl || req.url || '/';

  /*Просим репозиторий "authRepository" подсчитать количество записей в журнале лимитов запросов за указанный период по
  IP-адресу и URL в БД.*/
  const countRequestRateLimitLogs: number = await authRepository.countRequestRateLimitLogsByIpAndUrl(
    ip,
    url,
    Number(SETTINGS.REQUEST_RATE_LIMIT_TIME_IN_SECONDS)
  );

  /*Если за указанные период превышен лимит запросов по какому-то URL с какого-то IP-адреса, то сообщаем об этом
  клиенту.*/
  if (countRequestRateLimitLogs >= Number(SETTINGS.REQUEST_RATE_LIMIT))
    return res.sendStatus(HttpStatuses.TooManyRequest_429);

  /*Создаем объект записи для журнала лимитов запросов.*/
  const requestRateLimitLog: RequestRateLimitLogType = { ip, url, timestamp: new Date() };
  /*Просим репозиторий "authRepository" создать запись в журнале лимитов запросов в БД.*/
  await authRepository.createRequestRateLimitLog(requestRateLimitLog);
  /*Разрешаем дальнейшее выполнение запроса при помощи функции "next()".*/
  next();
};
