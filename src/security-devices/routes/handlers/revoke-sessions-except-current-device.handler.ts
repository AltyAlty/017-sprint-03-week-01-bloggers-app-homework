import { Request, Response } from 'express';
import { Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { IdType } from '../../../core/types/id.type';
import { authService } from '../../../auth/application/auth.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*Функция-обработчик для DELETE-запросов по отзыву всех сессий, кроме текущей.*/
export const revokeSessionsExceptCurrentDeviceHandler = async (
  req: Request<{}, {}, {}, {}, IdType>,
  res: Response
): Promise<void | Response> => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.userId!.id;
    /*Получаем ID устройства пользователя из сессии.*/
    const deviceId: string = req.deviceId!.id;

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
    return errorsHandler(error, res);
  }
};
