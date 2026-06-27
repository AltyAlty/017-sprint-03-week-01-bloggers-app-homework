import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { LoginDataInputDTO } from '../input-dto/login-data.input-dto';
import { authService } from '../../application/auth.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { LoginOutputDTO } from '../output-dto/login.output-dto';
import { ExtensionType, Result } from '../../../core/types/result/result.type';

/*Функция-обработчик для POST-запросов по аутентификации пользователя по логину/email.*/
export const authByLoginOrEmailHandler = async (
  req: Request<{}, {}, LoginDataInputDTO>,
  res: Response<LoginOutputDTO | ExtensionType[]>
): Promise<void | Response<LoginOutputDTO | ExtensionType[]>> => {
  try {
    /*Получаем логин/email и пароль пользователя.*/
    const { loginOrEmail, password }: { loginOrEmail: string; password: string } = req.body;
    /*Получаем имя устройства пользователя.*/
    const deviceName: string = req.headers['user-agent'] || 'Unknown Device';
    /*Получаем IP-адрес пользователя.*/
    const ip: string = req.ip || req.socket.remoteAddress || '0.0.0.0';

    /*Просим сервис "authService" аутентифицировать пользователя по логину/email и паролю.*/
    const loginUserResult: Result<{ accessToken: string; refreshToken: string } | null> = await authService.loginUser(
      loginOrEmail,
      password,
      deviceName,
      ip
    );

    /*Получаем HTTP-статус операции по аутентификации пользователя по логину/email и паролю.*/
    const loginUserResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(loginUserResult.status);

    /*Если аутентификация не прошла успешно, то сообщаем об этом клиенту.*/
    if (loginUserResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(loginUserResultHttpStatus).send(loginUserResult.extensions);
    }

    /*Если аутентификация прошла успешно, то отправляем AT (в теле ответа) и RT (в cookies) клиенту.*/
    return res
      .cookie('refreshToken', loginUserResult.data!.refreshToken, { httpOnly: true, secure: true })
      .status(loginUserResultHttpStatus)
      .send({ accessToken: loginUserResult.data!.accessToken });
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
