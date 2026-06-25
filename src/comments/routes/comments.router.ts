import { Router } from 'express';
import { idValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { getCommentByIdHandler } from './handlers/get-comment-by-id.handler';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/guard-middlewares/access-token.guard-middleware';
import { commentUpdateInputValidation } from '../validation/comments-input-validation.middlewares';
import { updateCommentByIdHandler } from './handlers/update-comment-by-id.handler';
import { deleteCommentByIdHandler } from './handlers/delete-comment-by-id.handler';
import { SETTINGS } from '../../core/settings/settings';

/*Роутер из Express для работы с данными по комментариям.*/
export const commentsRouter: Router = Router({});

/*Конфигурируем роутер "commentsRouter".*/
commentsRouter
  /*001. PUT-запрос по изменению комментария по ID, используя URI-параметры.*/
  .put(
    SETTINGS.UPDATE_COMMENT_BY_ID_PATH,
    accessTokenGuardMiddleware,
    idValidation,
    commentUpdateInputValidation,
    inputValidationResultMiddleware,
    updateCommentByIdHandler
  )
  /*002. DELETE-запрос по удалению комментария по ID, используя URI-параметры.*/
  .delete(
    SETTINGS.UPDATE_COMMENT_BY_ID_PATH,
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentByIdHandler
  )
  /*003. GET-запрос по получению комментария по ID, используя URI-параметры.*/
  .get(SETTINGS.GET_COMMENT_BY_ID_PATH, idValidation, inputValidationResultMiddleware, getCommentByIdHandler);
