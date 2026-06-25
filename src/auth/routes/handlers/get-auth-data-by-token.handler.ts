import { IdType } from '../../../core/types/id.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { Request, Response } from 'express';
import { usersQueryService } from '../../../users/application/users.query-service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { MeOutputDTO } from '../output-dto/me.output-dto';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { UserOutputDTO } from '../../../users/routes/output-dto/user.output-dto';

/*Функция-обработчик для GET-запросов по получению данных пользователя по токену.*/
export const getAuthDataByTokenHandler = async (
  req: Request<{}, {}, {}, {}, IdType>,
  res: Response<MeOutputDTO | ExtensionType[]>
) => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.userId?.id as string;
    /*Если ID пользователя не был найден, то сообщаем клиенту об отказе в аутентификации.*/
    if (!userId) return res.sendStatus(HttpStatuses.Unauthorized_401);
    /*Просим query-сервис "usersQueryService" найти пользователя по ID.*/
    const userResult: Result<{ userOutput: UserOutputDTO } | null> = await usersQueryService.findById(userId);
    /*Получаем HTTP-статус операции по поиску пользователя по ID.*/
    const userResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(userResult.status);

    /*Если пользователь не был найден, то сообщаем об этом клиенту.*/
    if (userResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(userResultHttpStatus).send(userResult.extensions);
    }

    /*Если пользователь был найден, то отправляем его данные клиенту.*/
    return res.status(userResultHttpStatus).send({
      login: userResult.data!.userOutput.login,
      email: userResult.data!.userOutput.email,
      userId: userResult.data!.userOutput.id,
    });
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
