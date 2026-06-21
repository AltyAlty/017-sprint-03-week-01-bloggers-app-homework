import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { usersService } from '../../application/users.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { ExtensionType, Result } from '../../../core/types/result/result.type';

/*Функция-обработчик "deleteUserByIdHandler()" для DELETE-запросов по удалению пользователя по ID, используя
URI-параметры.*/
export const deleteUserByIdHandler = async (req: Request<{ id: string }>, res: Response<void | ExtensionType[]>) => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.params.id;
    /*Просим сервис "usersService" удалить пользователя по ID.*/
    const deletedUserResult: Result<{} | null> = await usersService.deleteById(userId);
    /*Получаем HTTP-статус операции по удалению пользователя по ID.*/
    const deletedUserResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(deletedUserResult.status);

    /*Если пользователь не был удален, то сообщаем об этом клиенту.*/
    if (deletedUserResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(deletedUserResultHttpStatus).send(deletedUserResult.extensions);
    }

    /*Если пользователь был удален, то сообщаем об этом клиенту.*/
    res.sendStatus(deletedUserResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
