import { Request, Response } from 'express';
import { Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { IdType } from '../../../core/types/id.type';
import { authService } from '../../../auth/application/auth.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*Функция-обработчик для DELETE-запросов по отзыву всех сессий, кроме текущей.*/
export const revokeSessionsExceptCurrentDeviceHandler = async (req: Request<{}, {}, {}, {}, IdType>, res: Response) => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.userId?.id as string;
    /*Если ID пользователя не был найден, то сообщаем клиенту об отказе в аутентификации.*/
    if (!userId) return res.sendStatus(HttpStatuses.Unauthorized_401);
    /*Получаем ID устройства пользователя из сессии.*/
    const deviceId: string = req.deviceId?.id as string;
    /*Если ID устройства пользователя из сессии не был найден, то сообщаем клиенту об отказе в аутентификации.*/
    if (!deviceId) return res.sendStatus(HttpStatuses.Unauthorized_401);

    /*Просим сервис "authService" отозвать все сессии пользователя, кроме текущей.*/
    const revokeSessionsExceptCurrentDeviceResult: Result<{}> = await authService.revokeSessionsExceptCurrentDevice(
      userId,
      deviceId
    );

    /*Получаем HTTP-статус операции по отзыву всех сессий пользователя, кроме текущей.*/
    const revokeSessionsExceptCurrentDeviceResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(
      revokeSessionsExceptCurrentDeviceResult.status
    );

    /*Если отзыв сессий прошел успешно, то сообщаем об этом клиенту.*/
    return res.sendStatus(revokeSessionsExceptCurrentDeviceResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
