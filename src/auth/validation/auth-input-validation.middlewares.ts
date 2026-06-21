import { body } from 'express-validator';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserDBType } from '../../users/repositories/types/user-db.type';

const loginOrEmailValidation = body('loginOrEmail')
  .exists()
  .withMessage('Field "loginOrEmail" is required')
  .isString()
  .withMessage('field "loginOrEmail" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "loginOrEmail" must not be empty');

const passwordValidation = body('password')
  .exists()
  .withMessage('Field "password" is required')
  .isString()
  .withMessage('Field "password" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "password" must not be empty')
  .isLength({ min: 6, max: 20 })
  .withMessage('Field "password" must be between 6 and 20 characters');

/*Middleware "confirmationCodeValidation" проверяет, что поле "code":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Соответствует формату UUID.
5. Относится к пользователю, который ожидает подтверждения регистрации.
6. Не относится к пользователю, у которого уже была подтверждена регистрация.
7. Не имеет истекший срок действия.*/
export const confirmationCodeValidation = body('code')
  .exists()
  .withMessage('Field "code" is required')
  .isString()
  .withMessage('Field "code" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "code" must not be empty')
  .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  .withMessage('Field "code" is invalid')
  .custom(async (code: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по коду подтверждения в БД. Выкидываем ошибки с
    соответствующей информацией:
    1. Если пользователь не был найден, что означает, что код подтверждения некорректный.
    2. Если регистрация пользователя уже была подтверждена.
    3. Если срок действия кода подтверждения истек.*/
    const user: UserDBType | null = await usersRepository.findByConfirmationCode(code);
    if (!user) throw new Error('Field "code" is invalid');
    if (user.emailConfirmation.isConfirmed) throw new Error('Registration has already been confirmed');
    if (user.emailConfirmation.expirationDate <= new Date()) throw new Error('Confirmation code is expired');
    return true;
  });

/*Middleware "registrationEmailResendingValidation" проверяет, что поле "email":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Соответствует формату электронной почты.
5. Относится к пользователю, который ожидает подтверждения регистрации.
6. Не относится к пользователю, у которого уже была подтверждена регистрация.*/
export const registrationEmailResendingValidation = body('email')
  .exists()
  .withMessage('Field "email" is required')
  .isString()
  .withMessage('Field "email" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "email" must not be empty')
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  .withMessage('Field "email" is invalid')
  .isEmail()
  .withMessage('Field "email" is invalid')
  .custom(async (email: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по email в БД. Выкидываем ошибки с соответствующей
    информацией:
    1. Если пользователь не был найден, что означает, что email некорректный.
    2. Если регистрация пользователя уже была подтверждена.*/
    const user: UserDBType | null = await usersRepository.findByEmail(email);
    if (!user) throw new Error('Field "email" is invalid');
    if (user.emailConfirmation.isConfirmed) throw new Error('Registration has already been confirmed');
    return true;
  });

/*Комбинируем вышеуказанные middlewares в один middleware "authUserPostInputValidation", чтобы использовать его для
проверки запросов по аутентификации пользователя.*/
export const authUserPostInputValidation = [loginOrEmailValidation, passwordValidation];
