import { Request, Response } from 'express';
import { UpdateCommentInputDTO } from '../input-dto/update-comment.input-dto';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';

/*Функция-обработчик "updateCommentByIdHandler()" для PUT-запросов по изменению комментария по ID, используя
URI-параметры.*/
export const updateCommentByIdHandler = async (
  req: Request<{ id: string }, {}, UpdateCommentInputDTO>,
  res: Response<void | ExtensionType[]>
) => {
  try {
    /*Получаем ID комментария.*/
    const commentId: string = req.params.id;
    /*Получаем ID пользователя.*/
    const userId: string = req.userId?.id as string;
    /*Просим сервис "commentsService" изменить комментарий по ID.*/
    const updatedCommentResult: Result<{} | null> = await commentsService.updateById(commentId, req.body, userId);
    /*Получаем HTTP-статус операции по изменению комментария по ID.*/
    const updatedCommentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(updatedCommentResult.status);

    /*Если комментарий не был изменен, то сообщаем об этом клиенту.*/
    if (updatedCommentResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(updatedCommentResultHttpStatus).send(updatedCommentResult.extensions);
    }

    /*Если комментарий был изменен, то сообщаем об этом клиенту.*/
    res.sendStatus(updatedCommentResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
