import { NextFunction, Request, Response } from 'express';
import { authRepository } from '../../repositories/auth.repository';
import { RequestRateLimitLogType } from '../../application/types/request-rate-limit-log.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { SETTINGS } from '../../../core/settings/settings';

/*Middleware для лимитирования запросов.*/
export const requestRateLimitGuardMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  /*Получаем IP-адресс пользователя из запроса.*/
  const ip: string | undefined = req.ip || req.socket.remoteAddress;
  /*Если IP-адресс пользователя не был найден, то сообщаем об отказе в аутентификации клиенту.*/
  if (!ip) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если IP-адресс пользователя был найден, то получаем URL, по которому был сделан запрос.*/
  const url: string = req.originalUrl || req.url || '/';

  /*Просим репозиторий "authRepository" подсчитать количество записей в журнале лимитов запросов за указанный период по
  IP-адрессу и URL в БД.*/
  const countRequestRateLimitLogs: number = await authRepository.countRequestRateLimitLogsByIPAndUrl(
    ip,
    url,
    SETTINGS.REQUEST_RATE_LIMIT_TIME_IN_SECONDS
  );

  /*Если за указанные период превышен лимит запросов по какому-то URL с какого-то IP-адреса, то сообщаем об этом
  клиенту.*/
  if (countRequestRateLimitLogs >= SETTINGS.REQUEST_RATE_LIMIT) return res.sendStatus(HttpStatuses.TooManyRequest_429);
  /*Создаем объект записи для журнала лимитов запросов.*/
  const requestRateLimitLog: RequestRateLimitLogType = { ip, url, timestamp: new Date() };
  /*Просим репозиторий "authRepository" создать запись в журнале лимитов запросов в БД.*/
  await authRepository.createRequestRateLimitLog(requestRateLimitLog);
  /*Разрешаем дальнейшее выполнение запроса при помощи функции "next()".*/
  next();
};
