import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { CreateBlogInputDTO } from '../input-dto/create-blog.input-dto';
import { blogsQueryService } from '../../application/blogs.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { BlogOutputDTO } from '../output-dto/blog.output-dto';
import { ExtensionType, Result } from '../../../core/types/result/result.type';

/*Функция-обработчик "createBlogHandler()" для POST-запросов по добавлению блога.*/
export const createBlogHandler = async (
  req: Request<{}, {}, CreateBlogInputDTO>,
  res: Response<BlogOutputDTO | ExtensionType[]>
) => {
  try {
    /*Просим сервис "blogsService" создать блог.*/
    const createdBlogResult: Result<{ blogId: string }> = await blogsService.create(req.body);
    /*Получаем HTTP-статус операции по созданию блога.*/
    const createdBlogResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(createdBlogResult.status);

    /*Просим query-сервис "blogsQueryService" найти созданный блог по ID.*/
    const blogResult: Result<{ blogOutput: BlogOutputDTO } | null> = await blogsQueryService.findById(
      createdBlogResult.data.blogId
    );

    /*Получаем HTTP-статус операции по поиску созданного блога по ID.*/
    const blogResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(blogResult.status);

    /*Если созданный блог не был найден, то сообщаем об этом клиенту.*/
    if (blogResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(blogResultHttpStatus).send(blogResult.extensions);
    }

    /*Если созданный блог был найден, то отправляем его клиенту.*/
    res.status(createdBlogResultHttpStatus).send(blogResult.data!.blogOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
