import { Request, Response } from 'express';
import { IdType } from '../../../core/types/id.type';
import { RevokeSessionByDeviceIdUriInputDTO } from '../input-dto/uri/revoke-session-by-device-id-uri.input-dto';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../../auth/application/auth.service';

/*Функция-обработчик для DELETE-запросов по отзыву сессии по ID устройства, используя URI-параметры.*/
export const revokeSessionByDeviceIdHandler = async (
  req: Request<RevokeSessionByDeviceIdUriInputDTO, {}, {}, {}, IdType>,
  res: Response<void | ExtensionType[]>
): Promise<void | Response<void | ExtensionType[]>> => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.userId!.id;
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
    if (revokeSessionByDeviceIdResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(revokeSessionByDeviceIdResultHttpStatus).send(revokeSessionByDeviceIdResult.extensions);
    }

    /*Если отзыв сессии по ID пользователя и ID устройства пользователя прошел успешно, то сообщаем об этом клиенту.*/
    return res.sendStatus(revokeSessionByDeviceIdResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
