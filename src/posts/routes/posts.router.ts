import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { basicAuthGuardMiddleware } from '../../auth/middlewares/guard-middlewares/basic-auth.guard-middleware';
import { idValidation, postIdValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { postCreateInputValidation, postUpdateInputValidation } from '../validation/posts-input-validation.middlewares';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { updatePostByIdHandler } from './handlers/update-post-by-id.handler';
import { paginationValidationMiddleware } from '../../core/middlewares/validation/pagination-validation.middleware';
import { PostSortFieldQueryInputDTO } from './input-dto/query/post-sort-field-query.input-dto';
import { deletePostByIdHandler } from './handlers/delete-post-by-id.handler';
import { CommentSortFieldQueryInputDTO } from '../../comments/routes/input-dto/query/comment-sort-field-query.input-dto';
import { getCommentListByPostIdHandler } from './handlers/get-comment-list-by-post-id.handler';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/guard-middlewares/access-token.guard-middleware';
import { commentInPostCreateInputValidation } from '../../comments/validation/comments-input-validation.middlewares';
import { createCommentForPostHandler } from './handlers/creat-comment-for-post-by-id.handler';
import { SETTINGS } from '../../core/settings/settings';

/*Роутер из Express для работы с данными по постам.*/
export const postsRouter: Router = Router({});

/*Конфигурируем роутер "postsRouter".*/
postsRouter
  /*001. GET-запрос по получению комментариев с пагинацией в посте по ID, используя URI-параметры и query-параметры.*/
  .get(
    SETTINGS.GET_COMMENT_LIST_BY_POST_ID_PATH,
    postIdValidation,
    paginationValidationMiddleware(CommentSortFieldQueryInputDTO),
    inputValidationResultMiddleware,
    getCommentListByPostIdHandler
  )
  /*002. POST-запрос по добавлению комментария в пост по ID, используя URI-параметры.*/
  .post(
    SETTINGS.CREATE_COMMENT_FOR_POST_PATH,
    accessTokenGuardMiddleware,
    postIdValidation,
    commentInPostCreateInputValidation,
    inputValidationResultMiddleware,
    createCommentForPostHandler
  )
  /*003. GET-запрос по получению постов с пагинацией, используя query-параметры.*/
  .get(
    SETTINGS.GET_POST_LIST_PATH,
    paginationValidationMiddleware(PostSortFieldQueryInputDTO),
    inputValidationResultMiddleware,
    getPostListHandler
  )
  /*004. POST-запрос по добавлению поста.*/
  .post(
    SETTINGS.CREATE_POST_PATH,
    basicAuthGuardMiddleware,
    postCreateInputValidation,
    inputValidationResultMiddleware,
    createPostHandler
  )
  /*005. GET-запрос по получению поста по ID, используя URI-параметры.*/
  .get(SETTINGS.GET_POST_BY_ID_PATH, idValidation, inputValidationResultMiddleware, getPostByIdHandler)
  /*006. PUT-запрос по изменению поста по ID, используя URI-параметры.*/
  .put(
    SETTINGS.UPDATE_POST_BY_ID_PATH,
    basicAuthGuardMiddleware,
    idValidation,
    postUpdateInputValidation,
    inputValidationResultMiddleware,
    updatePostByIdHandler
  )
  /*007. DELETE-запрос по удалению поста по ID, используя URI-параметры.*/
  .delete(
    SETTINGS.DELETE_POST_BY_ID_PATH,
    basicAuthGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostByIdHandler
  );
