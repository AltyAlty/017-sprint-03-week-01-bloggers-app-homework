import { Router } from 'express';
import { paginationValidationMiddleware } from '../../core/middlewares/validation/pagination-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { basicAuthGuardMiddleware } from '../../auth/middlewares/guard-middlewares/basic-auth.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { getUserListHandler } from './handlers/get-user-list.handler';
import { UserSortFieldInputDTO } from './input-dto/user-sort-field.input-dto';
import { createUserHandler } from './handlers/create-user.handler';
import { deleteUserByIdHandler } from './handlers/delete-user-by-id.handler';
import { userCreateInputValidation } from '../validation/user-input-validation.middlewares';
import { SETTINGS } from '../../core/settings/settings';

/*Роутер из Express для работы с данными по пользователям.*/
export const usersRouter: Router = Router({});
/*Применяем middleware "basicAuthGuardMiddleware" ко всем маршрутам.*/
usersRouter.use(basicAuthGuardMiddleware);

/*Конфигурируем роутер "usersRouter".*/
usersRouter
  /*001. GET-запрос по получению пользователей с пагинацией, используя query-параметры.*/
  .get(
    SETTINGS.GET_USERS_LIST_PATH,
    paginationValidationMiddleware(UserSortFieldInputDTO),
    inputValidationResultMiddleware,
    getUserListHandler
  )
  /*002. POST-запрос по добавлению пользователя.*/
  .post(SETTINGS.CREATE_USER_PATH, userCreateInputValidation, inputValidationResultMiddleware, createUserHandler)
  /*003. DELETE-запрос по удалению пользователя по ID, используя URI-параметры.*/
  .delete(SETTINGS.DELETE_USER_BY_ID_PATH, idValidation, inputValidationResultMiddleware, deleteUserByIdHandler);
