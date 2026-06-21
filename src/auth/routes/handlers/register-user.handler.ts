import { Request, Response } from 'express';
import { CreateUserInputDTO } from '../../../users/routes/input-dto/create-user.input-dto';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';

/*Функция-обработчик "registerUserHandler()" для POST-запросов по регистрации пользователя.*/
export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInputDTO>,
  res: Response<void | ExtensionType[]>
) => {
  try {
    /*Просим сервис "authService" зарегистрировать пользователя.*/
    const registerUserResult: Result<{ createdUserId: string } | null> = await authService.registerUser(req.body);
    /*Получаем HTTP-статус операции по регистрации пользователя.*/
    const registerUserResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(registerUserResult.status);

    /*Если пользователь не был зарегистрирован, то сообщаем об этом клиенту.*/
    if (registerUserResultHttpStatus !== HttpStatuses.Created_201) {
      return res.status(registerUserResultHttpStatus).send(registerUserResult.extensions);
    }

    /*Если пользователь был зарегистрирован, то сообщаем об этом клиенту.*/
    res.sendStatus(HttpStatuses.NoContent_204);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
