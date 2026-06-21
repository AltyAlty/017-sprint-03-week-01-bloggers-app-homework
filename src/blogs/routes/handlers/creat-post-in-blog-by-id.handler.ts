import { Request, Response } from 'express';
import { postsService } from '../../../posts/application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { CreatePostInBlogInputDTO } from '../../../posts/routes/input-dto/create-post-in-blog.input-dto';
import { postsQueryService } from '../../../posts/application/posts.query-service';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/map-result-code-to-http-status';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { PostOutputDTO } from '../../../posts/routes/output-dto/post.output-dto';

/*Функция-обработчик "createPostInBlogHandler()" для POST-запросов по добавлению поста в блог по ID, используя
URI-параметры.*/
export const createPostInBlogHandler = async (
  req: Request<{ blogId: string }, {}, CreatePostInBlogInputDTO>,
  res: Response<PostOutputDTO | ExtensionType[]>
) => {
  try {
    /*Получаем ID блога.*/
    const blogId: string = req.params.blogId;
    /*Просим сервис "postsService" создать пост в блоге.*/
    const createdPostResult: Result<{ postId: string } | null> = await postsService.create({ ...req.body, blogId });
    /*Получаем HTTP-статус операции по созданию поста в блоге.*/
    const createdPostResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(createdPostResult.status);

    /*Если пост не был создан в блоге, то сообщаем об этом клиенту.*/
    if (createdPostResultHttpStatus !== HttpStatuses.Created_201) {
      return res.status(createdPostResultHttpStatus).send(createdPostResult.extensions);
    }

    /*Если пост был создан в блоге, то просим query-сервис "postsQueryService" найти созданный пост по ID.*/
    const postResult: Result<{ postOutput: PostOutputDTO } | null> = await postsQueryService.findById(
      createdPostResult.data!.postId
    );

    /*Получаем HTTP-статус операции по поиску созданного поста в блоге по ID.*/
    const postResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(postResult.status);

    /*Если созданный пост не был найден в блоге, то сообщаем об этом клиенту.*/
    if (postResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(postResultHttpStatus).send(postResult.extensions);
    }

    /*Если созданный пост был найден в блоге, то отправляем его клиенту.*/
    res.status(createdPostResultHttpStatus).send(postResult.data!.postOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
