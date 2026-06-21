/*Тип для списка кодов ответов сервера.*/
export enum HttpStatuses {
  Ok_200 = 200,
  Created_201 = 201,
  NoContent_204 = 204,
  BadRequest_400 = 400,
  Unauthorized_401 = 401,
  Forbidden_403 = 403,
  NotFound_404 = 404,
  UnprocessableEntity_422 = 422,
  InternalServerError_500 = 500,
}
