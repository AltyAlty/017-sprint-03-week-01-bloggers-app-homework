import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { UpdateBlogInputDTO } from '../input-dto/update-blog.input-dto';
import { blogsService } from '../../application/blogs.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';

/*Функция-обработчик "updateBlogByIdHandler()" для PUT-запросов по изменению блога по ID, используя URI-параметры.*/
export const updateBlogByIdHandler = async (
  req: Request<{ id: string }, {}, UpdateBlogInputDTO>,
  res: Response<void | ExtensionType[]>
) => {
  try {
    /*Получаем ID блога.*/
    const blogId: string = req.params.id;
    /*Просим сервис "blogsService" изменить блог по ID.*/
    const updatedBlogResult: Result<{} | null> = await blogsService.updateById(blogId, req.body);
    /*Получаем HTTP-статус операции по изменению блога по ID.*/
    const updatedBlogResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(updatedBlogResult.status);

    /*Если блог не был изменен, то сообщаем об этом клиенту.*/
    if (updatedBlogResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(updatedBlogResultHttpStatus).send(updatedBlogResult.extensions);
    }

    /*Если блог был изменен, то сообщаем об этом клиенту.*/
    res.sendStatus(updatedBlogResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
