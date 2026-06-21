import { Router } from 'express';
import { authByLoginOrEmailHandler } from './handlers/auth-by-login-or-email.handler';
import {
  authUserPostInputValidation,
  confirmationCodeValidation,
  registrationEmailResendingValidation,
} from '../validation/auth-input-validation.middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { accessTokenGuardMiddleware } from '../middlewares/guard-middlewares/access-token.guard-middleware';
import { getAuthDataByTokenHandler } from './handlers/get-auth-data-by-token.handler';
import { userCreateInputValidation } from '../../users/validation/user-input-validation.middlewares';
import { registerUserHandler } from './handlers/register-user.handler';
import { confirmUserByCodeHandler } from './handlers/confirm-user-by-code.handler';
import { resendConfirmationEmailHandler } from './handlers/resend-confirmation-email.handler';
import { SETTINGS } from '../../core/settings/settings';
import { refreshTokenGuardMiddleware } from '../middlewares/guard-middlewares/refresh-token.guard-middleware';
import { refreshAccessAndRefreshTokensHandler } from './handlers/refresh-access-and-refresh-tokens.handler';
import { revokeRefreshTokenHandler } from './handlers/revoke-refresh-token';

/*Роутер из Express для работы с аутентификацией и авторизацией.*/
export const authRouter: Router = Router({});
/*Конфигурируем роутер "authRouter".*/
authRouter
  /*001. POST-запрос по аутентификации пользователя по логину/email.*/
  .post(
    SETTINGS.AUTH_BY_LOGIN_OR_EMAIL_PATH,
    authUserPostInputValidation,
    inputValidationResultMiddleware,
    authByLoginOrEmailHandler
  )
  /*002. GET-запрос по получению данных пользователя по токену.*/
  .get(SETTINGS.GET_AUTH_DATA_BY_TOKEN_PATH, accessTokenGuardMiddleware, getAuthDataByTokenHandler)
  /*003. POST-запрос по регистрации пользователя.*/
  .post(SETTINGS.REGISTER_USER_PATH, userCreateInputValidation, inputValidationResultMiddleware, registerUserHandler)
  /*004. POST-запрос по подтверждению регистрации пользователя по коду.*/
  .post(
    SETTINGS.CONFIRM_USER_BY_CODE_PATH,
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    confirmUserByCodeHandler
  )
  /*005. POST-запрос по повторной отправке письма для подтверждения регистрация пользователя.*/
  .post(
    SETTINGS.RESEND_CONFIRMATION_EMAIL_PATH,
    registrationEmailResendingValidation,
    inputValidationResultMiddleware,
    resendConfirmationEmailHandler
  )
  /*006. POST-запрос по получению новой пары AT/RT.*/
  .post(
    SETTINGS.REFRESH_TOKEN_PATH,
    refreshTokenGuardMiddleware,
    inputValidationResultMiddleware,
    refreshAccessAndRefreshTokensHandler
  )
  /*007. POST-запрос по отзыву RT.*/
  .post(SETTINGS.LOGOUT_PATH, refreshTokenGuardMiddleware, inputValidationResultMiddleware, revokeRefreshTokenHandler);
