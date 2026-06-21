import { Response } from 'express';
import { HttpStatuses } from '../types/http-statuses';
import { DomainError } from './domain.error';
import { createErrorMessages } from '../middlewares/validation/input-validation-result.middleware';

/*Функция "errorsHandler()" занимается перехватом ошибок в UI слое.*/
export const errorsHandler = (error: unknown, res: Response): void => {
  /*Если перехваченная ошибка является ошибкой, когда к сущности нельзя применить какую-то операцию в BLL, то
  сообщаем об этом клиенту.*/
  if (error instanceof DomainError) {
    const httpStatus: HttpStatuses = HttpStatuses.UnprocessableEntity_422;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          field: error.code,
          message: error.message,
        },
      ])
    );

    return;
  }

  /*Если же перехваченная ошибка является ошибкой какого-то другого типа, то сообщаем об этом клиенту.*/
  res.status(HttpStatuses.InternalServerError_500).json(error);
  return;
};
