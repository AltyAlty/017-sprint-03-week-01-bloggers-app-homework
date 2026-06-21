import { Request, Response } from 'express';
import { CreateCommentInPostInputDTO } from '../../../comments/routes/input-dto/create-comment-in-post.input-dto';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../../comments/application/comments.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { commentsQueryService } from '../../../comments/application/comments.query-service';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { CommentOutputDTO } from '../../../comments/routes/output-dto/comment.output-dto';

/*Функция-обработчик "createCommentInPostHandler()" для POST-запросов по добавлению нового комментария в пост по ID,
используя URI-параметры.*/
export const createCommentInPostHandler = async (
  req: Request<{ postId: string }, {}, CreateCommentInPostInputDTO>,
  res: Response<CommentOutputDTO | ExtensionType[]>
) => {
  try {
    /*Получаем ID поста.*/
    const postId: string = req.params.postId;
    /*Получаем ID пользователя.*/
    const userId: string = req.userId!.id as string;

    /*Просим сервис "commentsService" создать комментарий в посте.*/
    const createdCommentResult: Result<{ commentId: string } | null> = await commentsService.createInPost(
      postId,
      userId,
      req.body
    );

    /*Получаем HTTP-статус операции по созданию комментария в посте.*/
    const createdCommentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(createdCommentResult.status);

    /*Если комментарий не был создан в посте, то сообщаем об этом клиенту.*/
    if (createdCommentResultHttpStatus !== HttpStatuses.Created_201) {
      return res.status(createdCommentResultHttpStatus).send(createdCommentResult.extensions);
    }

    /*Если комментарий был создан в посте, то просим query-сервис "commentsQueryService" найти созданный комментарий по
    ID.*/
    const commentResult: Result<{ commentOutput: CommentOutputDTO } | null> = await commentsQueryService.findById(
      createdCommentResult.data!.commentId
    );

    /*Получаем HTTP-статус операции по поиску созданного комментария по ID.*/
    const commentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(commentResult.status);

    /*Если созданный комментарий не был найден, то сообщаем об этом клиенту.*/
    if (commentResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(commentResultHttpStatus).send(commentResult.extensions);
    }

    /*Если созданный комментарий был найден, то отправляем его клиенту.*/
    res.status(createdCommentResultHttpStatus).send(commentResult.data!.commentOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
