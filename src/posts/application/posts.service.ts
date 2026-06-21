import { postsRepository } from '../repositories/posts.repository';
import { PostType } from './types/post.type';
import { CreatePostInputDTO } from '../routes/input-dto/create-post.input-dto';
import { UpdatePostInputDTO } from '../routes/input-dto/update-post.input-dto';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { Result } from '../../core/types/result/result.type';
import { commentsService } from '../../comments/application/comments.service';
import { blogsService } from '../../blogs/application/blogs.service';
import { BlogOutputDTO } from '../../blogs/routes/output-dto/blog.output-dto';
import { PostOutputDTO } from '../routes/output-dto/post.output-dto';
import { mapToPostOutputDTO } from '../repositories/mappers/map-to-post-output-dto.util';
import { PostDBType } from '../repositories/types/post-db.type';

/*Сервис "postsService" для работы с постами.*/
export const postsService = {
  /*Метод "create()" для добавления поста.*/
  async create(dto: CreatePostInputDTO): Promise<Result<{ postId: string } | null>> {
    /*Просим сервис "blogsService" найти блог по ID.*/
    const blogResult: Result<{ blogOutput: BlogOutputDTO } | null> = await blogsService.findById(dto.blogId);
    /*Если блог не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (blogResult.status !== ResultStatuses.Ok) return blogResult as Result;

    /*Если блог был найден, то создаем объект с данными нового поста.*/
    const newPost: PostType = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogResult.data!.blogOutput.name,
      createdAt: new Date(),
    };

    /*Просим репозиторий "postsRepository" создать пост в БД.*/
    const postId: string = await postsRepository.create(newPost);

    /*Возвращаем ResultObject c ID созданного поста.*/
    return {
      status: ResultStatuses.Created,
      data: { postId },
      extensions: [],
    };
  },

  /*Метод "findById()" для поиска поста по ID.*/
  async findById(postId: string): Promise<Result<{ postOutput: PostOutputDTO } | null>> {
    /*Просим репозиторий "postsRepository" найти пост по ID в БД.*/
    const postDB: PostDBType | null = await postsRepository.findById(postId);

    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!postDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'postId', message: 'Not Found' }],
      };
    }

    /*Если пост был найден, то преобразовываем пост из БД в подготовленный для отправки клиенту пост.*/
    const postOutput: PostOutputDTO = mapToPostOutputDTO(postDB);

    /*Возвращаем ResultObject c преобразованным постом.*/
    return {
      status: ResultStatuses.Ok,
      data: { postOutput },
      extensions: [],
    };
  },

  /*Метод "findAllByBlogId()" для поиска постов в блоге по ID.*/
  async findAllByBlogId(blogId: string): Promise<Result<{ postsDB: PostDBType[] } | null>> {
    /*Просим репозиторий "postsRepository" найти посты в блоге по ID в БД.*/
    const postsDB: PostDBType[] | null = await postsRepository.findAllByBlogId(blogId);

    /*Если посты не были найдены, то возвращаем ResultObject с информацией об этом.*/
    if (!postsDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'blogId', message: 'Not Found' }],
      };
    }

    /*Если посты были найдены, то возвращаем ResultObject c постами.*/
    return {
      status: ResultStatuses.Ok,
      data: { postsDB },
      extensions: [],
    };
  },

  /*Метод "updateById()" для изменения поста по ID.*/
  async updateById(postId: string, dto: UpdatePostInputDTO): Promise<Result<{} | null>> {
    /*Просим репозиторий "postsRepository" изменить данные поста по ID в БД.*/
    const updatedPostCount: number = await postsRepository.updateById(postId, dto);

    /*Если пост не был изменен, то возвращаем ResultObject с информацией об этом.*/
    if (updatedPostCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'postId', message: 'Not Found' }],
      };
    }

    /*Если пост был изменен, то возвращаем ResultObject c информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод "deleteById()" для удаления поста по ID.*/
  async deleteById(postId: string): Promise<Result<{} | null>> {
    /*Просим сервис "commentsService" удалить комментарии в посте по ID.*/
    await commentsService.deleteManyByPostId(postId);
    /*Просим репозиторий "postsRepository" удалить пост по ID в БД.*/
    const deletedPostCount: number = await postsRepository.deleteById(postId);

    /*Если пост не был удален, то возвращаем ResultObject с информацией об этом.*/
    if (deletedPostCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'postId', message: 'Not Found' }],
      };
    }

    /*Если пост был удален, то возвращаем ResultObject c информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод "deleteManyByBlogId()" для удаления постов в блоге по ID.*/
  async deleteManyByBlogId(blogId: string): Promise<Result<{ deletedPostsCount: number } | null>> {
    /*Просим сервис "blogsService" найти блог по ID.*/
    const blogResult: Result<{ blogOutput: BlogOutputDTO } | null> = await blogsService.findById(blogId);
    /*Если блог не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (blogResult.status !== ResultStatuses.Ok) return blogResult as Result;
    /*Если блог был найден, то просим репозиторий "postsRepository" найти посты в блоге по ID в БД.*/
    const postsDB: PostDBType[] | null = await postsRepository.findAllByBlogId(blogId);

    /*Если посты в блоге были найдены, то удаляем комментарии внутри постов.*/
    if (postsDB) {
      /*Получаем массив ID постов внутри блога.*/
      const postIds: string[] = postsDB.map(post => String(post._id));
      /*Просим сервис "commentsService" удалить комментарии внутри постов по ID.*/
      await commentsService.deleteManyByPostIds(postIds);
    }

    /*Просим репозиторий "postsRepository" удалить посты в блоге по ID в БД.*/
    const deletedPostsCount: number = await postsRepository.deleteManyByBlogId(blogId);

    /*Возвращаем ResultObject c информацией об удалении постов.*/
    return {
      status: ResultStatuses.NoContent,
      data: { deletedPostsCount },
      extensions: [],
    };
  },
};
