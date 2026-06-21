import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { commentsQueryService } from '../../application/comments.query-service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { CommentOutputDTO } from '../output-dto/comment.output-dto';

/*Функция-обработчик "getCommentByIdHandler()" для GET-запросов по получению комментария по ID,
используя URI-параметры.*/
export const getCommentByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response<CommentOutputDTO | ExtensionType[]>
) => {
  try {
    /*Получаем ID комментария.*/
    const commentId: string = req.params.id;

    /*Просим query-сервис "commentsQueryService" найти комментарий по ID.*/
    const commentResult: Result<{ commentOutput: CommentOutputDTO } | null> =
      await commentsQueryService.findById(commentId);

    /*Получаем HTTP-статус операции по поиску комментария по ID.*/
    const commentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(commentResult.status);

    /*Если комментарий не был найден, то сообщаем об этом клиенту.*/
    if (commentResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(commentResultHttpStatus).send(commentResult.extensions);
    }

    /*Если комментарий был найден, то отправляем его клиенту.*/
    res.status(commentResultHttpStatus).send(commentResult.data?.commentOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
