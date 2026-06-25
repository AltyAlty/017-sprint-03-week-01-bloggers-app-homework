import { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogByIdHandler } from './handlers/update-blog-by-id.handler';
import { deleteBlogByIdHandler } from './handlers/delete-blog-by-id.handler';
import { blogIdValidation, idValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { blogCreateInputValidation, blogUpdateInputValidation } from '../validation/blogs-input-validation.middlewares';
import { basicAuthGuardMiddleware } from '../../auth/middlewares/guard-middlewares/basic-auth.guard-middleware';
import { paginationValidationMiddleware } from '../../core/middlewares/validation/pagination-validation.middleware';
import { getPostListByBlogIdHandler } from './handlers/get-post-list-by-blog-id.handler';
import { BlogSortFieldQueryInputDTO } from './input-dto/query/blog-sort-field-query.input-dto';
import { postInBlogCreateInputValidation } from '../../posts/validation/posts-input-validation.middlewares';
import { createPostForBlogByBlogIdHandler } from './handlers/creat-post-for-blog-by-blog-id.handler';
import { PostSortFieldQueryInputDTO } from '../../posts/routes/input-dto/query/post-sort-field-query.input-dto';
import { SETTINGS } from '../../core/settings/settings';

/*Роутер из Express для работы с данными по блогам.*/
export const blogsRouter: Router = Router({});

/*Конфигурируем роутер "blogsRouter".*/
blogsRouter
  /*001. GET-запрос по получению блогов с пагинацией, используя query-параметры.*/
  .get(
    SETTINGS.GET_BLOG_LIST_PATH,
    paginationValidationMiddleware(BlogSortFieldQueryInputDTO),
    inputValidationResultMiddleware,
    getBlogListHandler
  )
  /*002. POST-запрос по добавлению блога.*/
  .post(
    SETTINGS.CREATE_BLOG_PATH,
    basicAuthGuardMiddleware,
    blogCreateInputValidation,
    inputValidationResultMiddleware,
    createBlogHandler
  )
  /*003. GET-запрос по получению постов с пагинацией в блоге по ID, используя URI-параметры и query-параметры.*/
  .get(
    SETTINGS.GET_POST_LIST_BY_BLOG_ID_PATH,
    blogIdValidation,
    paginationValidationMiddleware(PostSortFieldQueryInputDTO),
    inputValidationResultMiddleware,
    getPostListByBlogIdHandler
  )
  /*004. POST-запрос по добавлению поста в блог по ID, используя URI-параметры.*/
  .post(
    SETTINGS.CREATE_POST_FOR_BLOG_PATH,
    basicAuthGuardMiddleware,
    blogIdValidation,
    postInBlogCreateInputValidation,
    inputValidationResultMiddleware,
    createPostForBlogByBlogIdHandler
  )
  /*005. GET-запрос по получению блога по ID, используя URI-параметры. При помощи ":" Express позволяет указывать
  переменные в пути. Такие переменные доступны через объект "req.params".*/
  .get(SETTINGS.GET_BLOG_BY_ID_PATH, idValidation, inputValidationResultMiddleware, getBlogByIdHandler)
  /*006. PUT-запрос по изменению блога по ID, используя URI-параметры.*/
  .put(
    SETTINGS.UPDATE_BLOG_BY_ID_PATH,
    basicAuthGuardMiddleware,
    idValidation,
    blogUpdateInputValidation,
    inputValidationResultMiddleware,
    updateBlogByIdHandler
  )
  /*007. DELETE-запрос по удалению блога по ID, используя URI-параметры.*/
  .delete(
    SETTINGS.DELETE_BLOG_BY_ID_PATH,
    basicAuthGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogByIdHandler
  );
