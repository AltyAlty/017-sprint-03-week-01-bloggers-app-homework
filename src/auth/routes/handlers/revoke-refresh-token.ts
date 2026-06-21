import { Request, Response } from 'express';
import { IdType } from '../../../core/types/id.type';
import { Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { authService } from '../../application/auth.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*Функция-обработчик "revokeRefreshTokenHandler()" для POST-запросов по отзыву RT.*/
export const revokeRefreshTokenHandler = async (req: Request<{}, {}, {}, {}, IdType>, res: Response<void>) => {
  try {
    /*Получаем RT.*/
    const refreshToken: string = req.cookies.refreshToken;
    /*Просим сервис "authService" отозвать RT.*/
    const revokeRefreshTokenResult: Result<{}> = await authService.revokeRefreshToken(refreshToken);
    /*Получаем HTTP-статус операции по отзыву RT.*/
    const revokeRefreshTokenResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(revokeRefreshTokenResult.status);
    /*Сообщаем об отзыве RT клиенту.*/
    return res.sendStatus(revokeRefreshTokenResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
