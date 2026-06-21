import { NextFunction, Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { jwtAdapter } from '../../adapters/jwt.adapter';
import { SETTINGS } from '../../../core/settings/settings';
import { authRepository } from '../../repositories/auth.repository';
import { IdType } from '../../../core/types/id.type';
import { RefreshTokenDBType } from '../../repositories/types/refresh-token-db.type';

/*Middleware "refreshTokenGuardMiddleware" отвечает за проверку RT в запросах.*/
export const refreshTokenGuardMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  /*Получаем RT из cookies в запросе.*/
  const refreshToken: string = req.cookies.refreshToken;
  /*Если в cookies запроса нет RT, то сообщаем об отказе в аутентификации клиенту.*/
  if (!refreshToken) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если в cookies запроса есть RT, то просим адаптер "jwtAdapter" верифицировать токен.*/
  const payload: { userId: string } | null = await jwtAdapter.verifyToken(refreshToken, SETTINGS.RT_SECRET!);
  /*Если верификация токена не прошла успешно, то сообщаем об отказе в аутентификации клиенту.*/
  if (!payload) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Просим репозиторий "authRepository" найти RT в БД.*/
  const refreshTokenDB: RefreshTokenDBType | null = await authRepository.findRT(refreshToken);
  /*Если RT в БД не было найдено, то сообщаем об отказе в аутентификации клиенту.*/
  if (!refreshTokenDB) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Если RT находится в черном списке, то сообщаем об отказе в аутентификации клиенту.*/
  if (refreshTokenDB.blacklisted) return res.sendStatus(HttpStatuses.Unauthorized_401);
  /*Извлекаем ID пользователя.*/
  const { userId }: { userId: string } = payload;
  /*Прикрепляем ID пользователя к запросу.*/
  req.userId = { id: userId } as IdType;
  /*Разрешаем дальнейшее выполнение запроса при помощи функции "next()".*/
  next();
};
