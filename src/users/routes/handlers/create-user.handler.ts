import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { CreateUserInputDTO } from '../input-dto/create-user.input-dto';
import { usersService } from '../../application/users.service';
import { usersQueryService } from '../../application/users.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { UserOutputDTO } from '../output-dto/user.output-dto';

/*Функция-обработчик "createUserHandler()" для POST-запросов по добавлению пользователя.*/
export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInputDTO>,
  res: Response<UserOutputDTO | ExtensionType[]>
) => {
  try {
    /*Просим сервис "usersService" создать пользователя.*/
    const createdUserResult: Result<{ userId: string }> = await usersService.create(req.body);
    /*Получаем HTTP-статус операции по созданию пользователя.*/
    const createdUserResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(createdUserResult.status);

    /*Просим query-сервис "usersQueryService" найти созданного пользователя по ID.*/
    const userResult: Result<{ userOutput: UserOutputDTO } | null> = await usersQueryService.findById(
      createdUserResult.data.userId
    );

    /*Получаем HTTP-статус операции по поиску созданного пользователя по ID.*/
    const userResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(userResult.status);

    /*Если созданный пользователь не был найден, то сообщаем об этом клиенту.*/
    if (userResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(userResultHttpStatus).send(userResult.extensions);
    }

    /*Если созданный пользователь был найден, то отправляем его клиенту.*/
    res.status(createdUserResultHttpStatus).send(userResult.data!.userOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
