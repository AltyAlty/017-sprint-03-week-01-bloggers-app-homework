import { Request, Response } from 'express';
import { db } from '../../../db/mongodb/mongo.db';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*Функция-обработчик для DELETE-запросов по очистке БД для целей тестирования.*/
export const clearDBHandler = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    /*Очищаем коллекции.*/
    await db.dropDB();
    /*Сообщаем об очистке БД клиенту.*/
    return res.sendStatus(HttpStatuses.NoContent_204);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
