/*Тип для списка кодов ответов сервера в ResultObject.*/
export enum ResultStatuses {
  Ok = 'Ok',
  Created = 'Created',
  NoContent = 'NoContent',
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  UnprocessableEntity = 'UnprocessableEntity',
  InternalServerError = 'InternalServerError',
}
