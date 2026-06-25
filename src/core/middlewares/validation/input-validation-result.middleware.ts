/*Импортируем функцию "validationResult()" из библиотеки express-validator для извлечения ошибок валидации из тела
запроса.*/
import { FieldValidationError, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpStatuses } from '../../types/http-statuses';
import { ValidationErrorListOutputDTO } from '../../types/validation/validation-error-list.output-dto';
import { ValidationErrorOutputDTO } from '../../types/validation/validation-error.output-dto';

/*Функция для формирования объекта с сообщениями об ошибках валидации, отправляемых клиенту.*/
export const createErrorMessages = (errors: ValidationErrorOutputDTO[]): ValidationErrorListOutputDTO => ({
  errorsMessages: errors,
});

/*Функция для преобразования валидационных ошибок из библиотеки express-validator в формат Output DTO для сообщений об
ошибках валидации, отправляемых клиенту.*/
const mapToValidationErrorOutputDTO = (error: ValidationError): ValidationErrorOutputDTO => {
  const expressError: FieldValidationError = error as unknown as FieldValidationError;
  return { field: expressError.path, message: expressError.msg };
};

/*Middleware для формирования ответа клиенту об ошибках валидации.*/
export const inputValidationResultMiddleware = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
  /*Если валидация при помощи библиотеки express-validator обнаруживает ошибки валидации, то информация об этих ошибках
  добавляется в объект запроса. Поэтому пытаемся здесь извлечь такие ошибки. Далее форматируем ошибки валидации при
  помощи функции "mapToValidationErrorOutputDTO()". Затем возвращаем массив, где для каждого поля оставляется только
  первая ошибка.*/
  const errors: ValidationErrorOutputDTO[] = validationResult(req)
    .formatWith(mapToValidationErrorOutputDTO)
    .array({ onlyFirstError: true });

  /*Если ошибки валидации были найдены, то сообщаем об этом клиенту.*/
  if (errors.length > 0) {
    res.status(HttpStatuses.BadRequest_400).json(createErrorMessages(errors));
    return;
  }

  /*Если ошибок валидации не было найдено, то передаем управление следующему обработчику.*/
  next();
};
