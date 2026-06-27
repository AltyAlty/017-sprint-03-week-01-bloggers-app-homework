import { UpdateCommentByIdInputDTO } from '../routes/input-dto/update-comment-by-id.input-dto';
import { Result } from '../../core/types/result/result.type';
import { commentsRepository } from '../repositories/comments.repository';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { CreateCommentForPostInputDTO } from '../routes/input-dto/create-comment-for-post.input-dto';
import { CommentType } from './types/comment.type';
import { usersService } from '../../users/application/users.service';
import { UserOutputDTO } from '../../users/routes/output-dto/user.output-dto';
import { postsService } from '../../posts/application/posts.service';
import { PostOutputDTO } from '../../posts/routes/output-dto/post.output-dto';
import { CommentDBType } from '../repositories/types/comment-db.type';

/*Сервис для работы с комментариями.*/
export const commentsService = {
  /*Метод для добавления комментария в пост.*/
  async createInPost(
    postId: string,
    userId: string,
    dto: CreateCommentForPostInputDTO
  ): Promise<Result<{ createdCommentId: string } | null>> {
    /*Просим сервис "usersService" найти пользователя по ID.*/
    const userResult: Result<{ userOutput: UserOutputDTO } | null> = await usersService.findById(userId);
    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (userResult.status !== ResultStatuses.Ok) return userResult as Result;
    /*Если пользователь был найден, то просим сервис "postsService" найти пост по ID.*/
    const postResult: Result<{ postOutput: PostOutputDTO } | null> = await postsService.findById(postId);
    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (postResult.status !== ResultStatuses.Ok) return postResult as Result;

    /*Если пользователь и пост были найдены, то создаем объект с данными нового комментария.*/
    const newComment: CommentType = {
      content: dto.content,
      postId: postId,
      commentatorInfo: { userId, userLogin: userResult.data!.userOutput.login },
      createdAt: new Date(),
    };

    /*Просим репозиторий "commentsRepository" создать комментарий в БД.*/
    const createdCommentId: string = await commentsRepository.create(newComment);

    /*Возвращаем ResultObject с ID созданного комментария.*/
    return {
      status: ResultStatuses.Created,
      data: { createdCommentId },
      extensions: [],
    };
  },

  /*Метод для изменения комментария по ID.*/
  async updateById(id: string, dto: UpdateCommentByIdInputDTO, userId?: string): Promise<Result<{} | null>> {
    /*Просим репозиторий "commentsRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await commentsRepository.findById(id);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Comment not found' }],
      };
    }

    /*Если комментарий был найден, но пользователь не является его автором, то возвращаем ResultObject с информацией об
    этом.*/
    if (userId && commentDB.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatuses.Forbidden,
        data: null,
        errorMessage: 'Forbidden',
        extensions: [{ field: 'user', message: 'Forbidden' }],
      };
    }

    /*Если пользователь является автором комментария, то просим репозиторий "commentsRepository" изменить комментарий по
    ID в БД.*/
    await commentsRepository.updateById(id, dto);

    /*Возвращаем ResultObject с информацией об изменении комментария.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод для удаления комментария по ID.*/
  async deleteById(id: string, userId?: string): Promise<Result<{} | null>> {
    /*Просим репозиторий "commentsRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await commentsRepository.findById(id);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Comment not found' }],
      };
    }

    /*Если комментарий был найден, но пользователь не является его автором, то возвращаем ResultObject с информацией об
    этом.*/
    if (userId && commentDB.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatuses.Forbidden,
        data: null,
        errorMessage: 'Forbidden',
        extensions: [{ field: 'user', message: 'Forbidden' }],
      };
    }

    /*Если пользователь является автором комментария, то просим репозиторий "commentsRepository" удалить комментарий по
    ID в БД.*/
    await commentsRepository.deleteById(id);

    /*Возвращаем ResultObject с информацией об удалении комментария.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод для удаления комментариев по ID поста.*/
  async deleteAllByPostId(postId: string): Promise<Result<{ deletedCommentsCount: number } | null>> {
    /*Просим сервис "postsService" найти пост по ID.*/
    const postResult: Result<{ postOutput: PostOutputDTO } | null> | null = await postsService.findById(postId);
    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (postResult.status !== ResultStatuses.Ok) return postResult as Result;
    /*Если пост был найден, то просим репозиторий "commentsRepository" удалить комментарии по ID поста в БД.*/
    const deletedCommentsCount: number = await commentsRepository.deleteAllByPostId(postId);

    /*Возвращаем ResultObject с информацией об удалении комментариев.*/
    return {
      status: ResultStatuses.NoContent,
      data: { deletedCommentsCount },
      extensions: [],
    };
  },

  /*Метод для удаления комментариев по ID пользователя.*/
  async deleteAllByUserId(userId: string): Promise<Result<{ deletedCommentsCount: number } | null>> {
    /*Просим сервис "usersService" найти пользователя по ID.*/
    const userResult: Result<{ userOutput: UserOutputDTO } | null> = await usersService.findById(userId);
    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (userResult.status !== ResultStatuses.Ok) return userResult as Result;
    /*Если пользователь был найден, то просим репозиторий "commentsRepository" удалить комментарии по ID пользователя в
    БД.*/
    const deletedCommentsCount: number = await commentsRepository.deleteAllByUserId(userId);

    /*Возвращаем ResultObject с информацией об удалении комментариев.*/
    return {
      status: ResultStatuses.NoContent,
      data: { deletedCommentsCount },
      extensions: [],
    };
  },

  /*Метод для удаления комментариев по ID постов.*/
  async deleteAllByPostIds(postIds: string[]): Promise<Result<{ deletedCommentsCount: number } | null>> {
    /*Просим репозиторий "commentsRepository" удалить комментарии по ID постов в БД.*/
    const deletedCommentsCount: number = await commentsRepository.deleteAllByPostIds(postIds);

    /*Возвращаем ResultObject с информацией об удалении комментариев.*/
    return {
      status: ResultStatuses.NoContent,
      data: { deletedCommentsCount },
      extensions: [],
    };
  },
};
