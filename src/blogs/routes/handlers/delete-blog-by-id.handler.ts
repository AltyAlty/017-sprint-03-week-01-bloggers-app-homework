import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';

/*Функция-обработчик "deleteBlogByIdHandler()" для DELETE-запросов по удалению блога по ID, используя URI-параметры.*/
export const deleteBlogByIdHandler = async (req: Request<{ id: string }>, res: Response<void | ExtensionType[]>) => {
  try {
    /*Получаем ID блога.*/
    const blogId: string = req.params.id;
    /*Просим сервис "blogsService" удалить блог по ID.*/
    const deletedBlogResult: Result<{} | null> = await blogsService.deleteById(blogId);
    /*Получаем HTTP-статус операции по удалению блога по ID.*/
    const deletedBlogResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(deletedBlogResult.status);

    /*Если блог не был удален, то сообщаем об этом клиенту.*/
    if (deletedBlogResultHttpStatus !== HttpStatuses.NoContent_204) {
      return res.status(deletedBlogResultHttpStatus).send(deletedBlogResult.extensions);
    }

    /*Если блог был удален, то сообщаем об этом клиенту.*/
    res.sendStatus(deletedBlogResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
