import { Request, Response } from 'express';
import { IdType } from '../../../core/types/id.type';
import { RefreshAccessAndRefreshTokensOutputDTO } from '../output-dto/refresh-token.output-dto';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { authService } from '../../application/auth.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';

/*Функция-обработчик для POST-запросов по получению новой пары AT/RT.*/
export const refreshAccessAndRefreshTokensHandler = async (
  req: Request<{}, {}, {}, {}, IdType>,
  res: Response<RefreshAccessAndRefreshTokensOutputDTO | ExtensionType[]>
) => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.userId?.id as string;
    /*Если ID пользователя не был найден, то сообщаем об отказе в аутентификации клиенту.*/
    if (!userId) return res.sendStatus(HttpStatuses.Unauthorized_401);
    /*Получаем ID устройства пользователя из сессии.*/
    const deviceId: string = req.deviceId?.id as string;
    /*Если ID устройства пользователя из сессии не был найден, то сообщаем об отказе в аутентификации клиенту.*/
    if (!deviceId) return res.sendStatus(HttpStatuses.Unauthorized_401);
    /*Получаем IP-адресс пользователя.*/
    const ip: string = req.ip || req.socket.remoteAddress || '0.0.0.0';
    /*Получаем текущий RT.*/
    const currentRefreshToken: string = req.cookies.refreshToken;
    /*Если текущий RT не был найден, то сообщаем об отказе в аутентификации клиенту.*/
    if (!currentRefreshToken) return res.sendStatus(HttpStatuses.Unauthorized_401);

    /*Просим сервис "authService" перевыпустить пару AT/RT.*/
    const createAccessAndRefreshTokensResult: Result<{ accessToken: string; refreshToken: string } | null> =
      await authService.refreshAccessAndRefreshTokens(userId, deviceId, ip, currentRefreshToken);

    /*Получаем HTTP-статус операции по перевыпуску пары AT/RT.*/
    const createAccessAndRefreshTokensResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(
      createAccessAndRefreshTokensResult.status
    );

    /*Если перевыпуск пары AT/RT не прошел успешно, то сообщаем об этом клиенту.*/
    if (createAccessAndRefreshTokensResultHttpStatus !== HttpStatuses.Ok_200) {
      return res
        .status(createAccessAndRefreshTokensResultHttpStatus)
        .send(createAccessAndRefreshTokensResult.extensions);
    }

    /*Если перевыпуск пары AT/RT прошел успешно, то отправляем AT (в теле ответа) и RT (в cookies) клиенту.*/
    return res
      .cookie('refreshToken', createAccessAndRefreshTokensResult.data!.refreshToken, { httpOnly: true, secure: true })
      .status(createAccessAndRefreshTokensResultHttpStatus)
      .send({ accessToken: createAccessAndRefreshTokensResult.data!.accessToken });
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
