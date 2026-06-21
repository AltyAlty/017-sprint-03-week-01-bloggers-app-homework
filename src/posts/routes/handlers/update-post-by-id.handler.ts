import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { UpdatePostInputDTO } from '../input-dto/update-post.input-dto';
import { postsService } from '../../application/posts.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { ExtensionType, Result } from '../../../core/types/result/result.type';

/*Функция-обработчик "updatePostByIdHandler()" для PUT-запросов по изменению поста по ID, используя URI-параметры.*/
export const updatePostByIdHandler = async (
  req: Request<{ id: string }, {}, UpdatePostInputDTO>,
  res: Response<void | ExtensionType[]>
) => {
  try {
    /*Получаем ID поста.*/
    const postId: string = req.params.id;
    /*Просим сервис "postsService" изменить пост по ID.*/
    const updatedPostResult: Result<{} | null> = await postsService.updateById(postId, req.body);
    /*Получаем HTTP-статус операции по изменению поста по ID.*/
    const updatedPostResultHttpStatuses: HttpStatuses = mapResultCodeToHttpStatus(updatedPostResult.status);

    /*Если пост не был изменен, то сообщаем об этом клиенту.*/
    if (updatedPostResultHttpStatuses !== HttpStatuses.NoContent_204) {
      return res.status(updatedPostResultHttpStatuses).send(updatedPostResult.extensions);
    }

    /*Если пост был изменен, то сообщаем об этом клиенту.*/
    res.sendStatus(updatedPostResultHttpStatuses);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
