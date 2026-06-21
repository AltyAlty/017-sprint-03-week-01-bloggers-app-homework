import { ResultStatuses } from '../../types/result/result-statuses';
import { HttpStatuses } from '../../types/http-statuses';

/*Функция "mapResultCodeToHttpStatus" преобразовывает статус кода ответа сервера из формата ResultObject в формат
"HttpStatuses".*/
export const mapResultCodeToHttpStatus = (resultCode: ResultStatuses): number => {
  switch (resultCode) {
    case ResultStatuses.Ok:
      return HttpStatuses.Ok_200;

    case ResultStatuses.Created:
      return HttpStatuses.Created_201;

    case ResultStatuses.NoContent:
      return HttpStatuses.NoContent_204;

    case ResultStatuses.BadRequest:
      return HttpStatuses.BadRequest_400;

    case ResultStatuses.Unauthorized:
      return HttpStatuses.Unauthorized_401;

    case ResultStatuses.Forbidden:
      return HttpStatuses.Forbidden_403;

    case ResultStatuses.NotFound:
      return HttpStatuses.NotFound_404;

    case ResultStatuses.UnprocessableEntity:
      return HttpStatuses.UnprocessableEntity_422;

    default:
      return HttpStatuses.InternalServerError_500;
  }
};
