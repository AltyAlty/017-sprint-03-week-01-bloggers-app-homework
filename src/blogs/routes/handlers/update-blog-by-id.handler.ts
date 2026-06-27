import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { UpdateBlogByIdInputDTO } from '../input-dto/update-blog-by-id.input-dto';
import { blogsService } from '../../application/blogs.service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { UpdateBlogByIdUriInputDTO } from '../input-dto/uri/update-blog-by-id-uri.input-dto';

/*Функция-обработчик для PUT-запросов по изменению блога по ID, используя URI-параметры.*/
export const updateBlogByIdHandler = async (
  req: Request<UpdateBlogByIdUriInputDTO, {}, UpdateBlogByIdInputDTO>,
  res: Response<void | ExtensionType[]>
): Promise<void | Response<void | ExtensionType[]>> => {
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
    return res.sendStatus(updatedBlogResultHttpStatus);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
