import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { UpdatePostByIdInputDTO } from '../input-dto/update-post-by-id.input-dto';
import { postsService } from '../../application/posts.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { UpdatePostByIdUriInputDTO } from '../input-dto/uri/update-post-by-id-uri.input-dto';

/*Функция-обработчик для PUT-запросов по изменению поста по ID, используя URI-параметры.*/
export const updatePostByIdHandler = async (
  req: Request<UpdatePostByIdUriInputDTO, {}, UpdatePostByIdInputDTO>,
  res: Response<void | ExtensionType[]>
): Promise<void | Response<void | ExtensionType[]>> => {
  try {
    /*Получаем ID поста.*/
    const postId: string = req.params.id;
    /*Просим сервис "postsService" изменить пост по ID.*/
    const updatedPostResult: Result<{} | null> = await postsService.updateById(postId, req.body);
    /*Получаем HTTP-статус операции по изменению поста по ID.*/
    const updatedPostResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(updatedPostResult.status);

    /*Если пост не был изменен, то сообщаем об этом клиенту.*/
    if (updatedPostResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(updatedPostResultHttpStatus).send(updatedPostResult.extensions);
    }

    /*Если пост был изменен, то сообщаем об этом клиенту.*/
    return res.sendStatus(updatedPostResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
