import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { DeleteCommentByIdUriInputDTO } from '../input-dto/uri/delete-comment-by-id-uri.input-dto';

/*Функция-обработчик для DELETE-запросов по удалению комментария по ID, используя URI-параметры.*/
export const deleteCommentByIdHandler = async (
  req: Request<DeleteCommentByIdUriInputDTO>,
  res: Response<void | ExtensionType[]>
): Promise<void | Response<void | ExtensionType[]>> => {
  try {
    /*Получаем ID комментария.*/
    const commentId: string = req.params.id;
    /*Получаем ID пользователя.*/
    const userId: string = req.userId!.id;
    /*Просим сервис "commentsService" удалить комментарий по ID.*/
    const deletedCommentResult: Result<{} | null> = await commentsService.deleteById(commentId, userId);
    /*Получаем HTTP-статус операции по удалению комментария по ID.*/
    const deletedCommentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(deletedCommentResult.status);

    /*Если комментарий не был удален, то сообщаем об этом клиенту.*/
    if (deletedCommentResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(deletedCommentResultHttpStatus).send(deletedCommentResult.extensions);
    }

    /*Если комментарий был удален, то сообщаем об этом клиенту.*/
    return res.sendStatus(deletedCommentResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
