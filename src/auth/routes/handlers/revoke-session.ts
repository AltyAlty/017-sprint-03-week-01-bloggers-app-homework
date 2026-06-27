import { Request, Response } from 'express';
import { IdType } from '../../../core/types/id.type';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { authService } from '../../application/auth.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*Функция-обработчик для POST-запросов по отзыву сессии.*/
export const revokeSessionHandler = async (
  req: Request<{}, {}, {}, {}, IdType>,
  res: Response<void | ExtensionType[]>
): Promise<void | Response<void | ExtensionType[]>> => {
  try {
    /*Получаем RT.*/
    const refreshToken: string = req.cookies.refreshToken;
    /*Просим сервис "authService" отозвать сессию.*/
    const revokeSessionResult: Result<{} | null> = await authService.revokeSession(refreshToken);
    /*Получаем HTTP-статус операции по отзыву сессии.*/
    const revokeRefreshTokenResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(revokeSessionResult.status);

    /*Если отзыв сессии не прошел успешно, то сообщаем об этом клиенту.*/
    if (revokeRefreshTokenResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(revokeRefreshTokenResultHttpStatus).send(revokeSessionResult.extensions);
    }

    /*Если отзыв сессии прошел успешно, то сообщаем об этом клиенту.*/
    return res.sendStatus(revokeRefreshTokenResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
