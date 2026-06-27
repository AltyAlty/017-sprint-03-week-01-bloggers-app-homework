import { postsRepository } from '../repositories/posts.repository';
import { PostType } from './types/post.type';
import { CreatePostInputDTO } from '../routes/input-dto/create-post.input-dto';
import { UpdatePostByIdInputDTO } from '../routes/input-dto/update-post-by-id.input-dto';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { Result } from '../../core/types/result/result.type';
import { commentsService } from '../../comments/application/comments.service';
import { blogsService } from '../../blogs/application/blogs.service';
import { BlogOutputDTO } from '../../blogs/routes/output-dto/blog.output-dto';
import { PostOutputDTO } from '../routes/output-dto/post.output-dto';
import { mapToPostOutputDTO } from '../repositories/mappers/map-to-post-output-dto.util';
import { PostDBType } from '../repositories/types/post-db.type';

/*Сервис для работы с постами.*/
export const postsService = {
  /*Метод для добавления поста.*/
  async create(dto: CreatePostInputDTO): Promise<Result<{ createdPostId: string } | null>> {
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
    const createdPostId: string = await postsRepository.create(newPost);

    /*Возвращаем ResultObject с ID созданного поста.*/
    return {
      status: ResultStatuses.Created,
      data: { createdPostId },
      extensions: [],
    };
  },

  /*Метод для поиска поста по ID.*/
  async findById(id: string): Promise<Result<{ postOutput: PostOutputDTO } | null>> {
    /*Просим репозиторий "postsRepository" найти пост по ID в БД.*/
    const postDB: PostDBType | null = await postsRepository.findById(id);

    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!postDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Если пост был найден, то преобразовываем пост из БД в подготовленный для отправки клиенту пост.*/
    const postOutput: PostOutputDTO = mapToPostOutputDTO(postDB);

    /*Возвращаем ResultObject с преобразованным постом.*/
    return {
      status: ResultStatuses.Ok,
      data: { postOutput },
      extensions: [],
    };
  },

  /*Метод для изменения поста по ID.*/
  async updateById(id: string, dto: UpdatePostByIdInputDTO): Promise<Result<{} | null>> {
    /*Просим репозиторий "postsRepository" изменить данные поста по ID в БД.*/
    const updatedPostCount: number = await postsRepository.updateById(id, dto);

    /*Если пост не был изменен, то возвращаем ResultObject с информацией об этом.*/
    if (updatedPostCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Если пост был изменен, то возвращаем ResultObject с информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод для удаления поста по ID.*/
  async deleteById(id: string): Promise<Result<{} | null>> {
    /*Просим сервис "commentsService" удалить комментарии в посте по ID.*/
    await commentsService.deleteAllByPostId(id);
    /*Просим репозиторий "postsRepository" удалить пост по ID в БД.*/
    const deletedPostCount: number = await postsRepository.deleteById(id);

    /*Если пост не был удален, то возвращаем ResultObject с информацией об этом.*/
    if (deletedPostCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Если пост был удален, то возвращаем ResultObject с информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод для удаления постов по ID блога.*/
  async deleteAllByBlogId(blogId: string): Promise<Result<{ deletedPostsCount: number } | null>> {
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
      /*Просим сервис "commentsService" удалить комментарии по ID постов.*/
      await commentsService.deleteAllByPostIds(postIds);
    }

    /*Просим репозиторий "postsRepository" удалить посты по ID блога в БД.*/
    const deletedPostsCount: number = await postsRepository.deleteAllByBlogId(blogId);

    /*Возвращаем ResultObject с информацией об удалении постов.*/
    return {
      status: ResultStatuses.NoContent,
      data: { deletedPostsCount },
      extensions: [],
    };
  },
};
