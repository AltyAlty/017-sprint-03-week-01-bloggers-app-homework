import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsQueryService } from '../../application/blogs.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { BlogOutputDTO } from '../output-dto/blog.output-dto';
import { GetBlogByIdUriInputDTO } from '../input-dto/uri/get-blog-by-id-uri.input-dto';

/*Функция-обработчик для GET-запросов по получению блога по ID, используя URI-параметры.*/
export const getBlogByIdHandler = async (
  req: Request<GetBlogByIdUriInputDTO>,
  res: Response<BlogOutputDTO | ExtensionType[]>
): Promise<void | Response<BlogOutputDTO | ExtensionType[]>> => {
  try {
    /*Получаем ID блога.*/
    const blogId: string = req.params.id;
    /*Просим query-сервис "blogsQueryService" найти блог по ID.*/
    const blogResult: Result<{ blogOutput: BlogOutputDTO } | null> = await blogsQueryService.findById(blogId);
    /*Получаем HTTP-статус операции по поиску блога по ID.*/
    const blogResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(blogResult.status);

    /*Если блог не был найден, то сообщаем об этом клиенту.*/
    if (blogResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(blogResultHttpStatus).send(blogResult.extensions);
    }

    /*Если блог был найден, то отправляем его клиенту.*/
    return res.status(blogResultHttpStatus).send(blogResult.data!.blogOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
