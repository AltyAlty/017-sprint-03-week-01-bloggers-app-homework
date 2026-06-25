import { Request, Response } from 'express';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { authService } from '../../application/auth.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { ResendConfirmationEmailInputDTO } from '../input-dto/resend-confirmation-email.input-dto';

/*Функция-обработчик для POST-запросов по повторной отправке письма для подтверждения регистрация пользователя.*/
export const resendConfirmationEmailHandler = async (
  req: Request<{}, {}, ResendConfirmationEmailInputDTO>,
  res: Response<void | ExtensionType[]>
) => {
  try {
    /*Получаем почту регистрируемого пользователя.*/
    const email: string = req.body.email;
    /*Просим сервис "authService" повторно отправить письмо для подтверждения регистрация пользователя.*/
    const resendConfirmationEmailResult: Result<{} | null> = await authService.resendConfirmationEmail(email);

    /*Получаем HTTP-статус операции по повторной отправке письма для подтверждения регистрация пользователя.*/
    const resendConfirmationEmailResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(
      resendConfirmationEmailResult.status
    );

    /*Если повторная отправка письма для подтверждения регистрация пользователя не прошла успешно, то сообщаем об этом
    клиенту.*/
    if (resendConfirmationEmailResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(resendConfirmationEmailResultHttpStatus).send(resendConfirmationEmailResult.extensions);
    }

    /*Если повторная отправка письма для подтверждения регистрация пользователя прошла успешно, то сообщаем об этом
    клиенту.*/
    res.sendStatus(resendConfirmationEmailResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
