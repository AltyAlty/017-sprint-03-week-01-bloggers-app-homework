import { Request, Response } from 'express';
import { IdType } from '../../../core/types/id.type';
import { RevokeSessionByDeviceIdUriInputDTO } from '../input-dto/uri/revoke-session-by-device-id-uri.input-dto';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { Result } from '../../../core/types/result/result.type';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../../auth/application/auth.service';

/*Функция-обработчик для DELETE-запросов по отзыву сессии по ID устройства, используя URI-параметры.*/
export const revokeSessionByDeviceIdHandler = async (
  req: Request<RevokeSessionByDeviceIdUriInputDTO, {}, {}, {}, IdType>,
  res: Response
) => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.userId?.id as string;
    /*Если ID пользователя не был найден, то сообщаем клиенту об отказе в аутентификации.*/
    if (!userId) return res.sendStatus(HttpStatuses.Unauthorized_401);
    /*Получаем ID устройства.*/
    const deviceId: string = req.params.id;

    /*Просим сервис "authService" отозвать сессию по ID пользователя и ID устройства пользователя.*/
    const revokeSessionByDeviceIdResult: Result<{} | null> = await authService.revokeSessionByUserIdAndDeviceId(
      userId,
      deviceId
    );

    /*Получаем HTTP-статус операции по отзыву сессии по ID пользователя и ID устройства пользователя.*/
    const revokeSessionByDeviceIdResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(
      revokeSessionByDeviceIdResult.status
    );

    /*Если отзыв сессии по ID пользователя и ID устройства пользователя не прошел успешно, то сообщаем об этом
    клиенту.*/
    if (revokeSessionByDeviceIdResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(revokeSessionByDeviceIdResultHttpStatus).send(revokeSessionByDeviceIdResult.extensions);
    }

    /*Если отзыв сессии по ID пользователя и ID устройства пользователя прошел успешно, то сообщаем об этом клиенту.*/
    return res.sendStatus(revokeSessionByDeviceIdResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
