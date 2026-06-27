import { Request, Response } from 'express';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { authService } from '../../application/auth.service';
import { RegistrationConfirmationCodeInputDTO } from '../input-dto/registration-confirmation-code.input-dto';

/*Функция-обработчик для POST-запросов по подтверждению регистрации пользователя по коду.*/
export const confirmUserByCodeHandler = async (
  req: Request<{}, {}, RegistrationConfirmationCodeInputDTO>,
  res: Response<void | ExtensionType[]>
): Promise<void | Response<void | ExtensionType[]>> => {
  try {
    /*Получаем код подтверждения регистрации пользователя.*/
    const code: string = req.body.code;
    /*Просим сервис "authService" подтвердить регистрацию пользователя по коду.*/
    const confirmEmailResult: Result<{} | null> = await authService.confirmUserByCode(code);
    /*Получаем HTTP-статус операции по подтверждению регистрации пользователя по коду.*/
    const confirmEmailResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(confirmEmailResult.status);

    /*Если подтверждение регистрации пользователя по коду не прошло успешно, то сообщаем об этом клиенту.*/
    if (confirmEmailResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(confirmEmailResultHttpStatus).send(confirmEmailResult.extensions);
    }

    /*Если подтверждение регистрации пользователя по коду прошло успешно, то сообщаем об этом клиенту.*/
    return res.sendStatus(confirmEmailResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
