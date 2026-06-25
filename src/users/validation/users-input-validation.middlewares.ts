import { body } from 'express-validator';
import { usersRepository } from '../repositories/users.repository';
import { UserDBType } from '../repositories/types/user-db.type';

/*Middleware для проверки, что поле "login":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Состоит из не менее 3 и не более 10 символов.
5. Содержит только буквы, цифры, нижние подчеркивания и тире.
6. Является уникальным в БД.*/
const loginValidation = body('login')
  .exists()
  .withMessage('Field "login" is required')
  .isString()
  .withMessage('Field "login" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "login" must not be empty')
  .isLength({ min: 3, max: 10 })
  .withMessage('Field "login" must be between 3 and 10 characters')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Field "login" can only contain letters, numbers, underscores and hyphens')
  .custom(async (login: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по логину в БД. Если пользователь будет найден, то это
    будет означать, что логин не уникальный. В таком случае выкидываем ошибку с информацией об этом.*/
    const user: UserDBType | null = await usersRepository.findByLoginOrEmail(login);
    if (user) throw new Error('Field "login" must be unique');
    return true;
  });

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

/*Middleware для проверки, что поле "email":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Соответствует формату электронной почты.
5. Является уникальным в БД.*/
const emailValidation = body('email')
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
    /*Просим репозиторий "usersRepository" найти пользователя по email в БД. Если пользователь будет найден, то это
    будет означать, что email не уникальный. В таком случае выкидываем ошибку с информацией об этом.*/
    const user: UserDBType | null = await usersRepository.findByLoginOrEmail(email);
    if (user) throw new Error('Field "email" must be unique');
    return true;
  });

/*Комбинируем вышеуказанные middlewares в один middleware для использования его для проверки запросов по созданию
пользователя.*/
export const userCreateInputValidation = [loginValidation, passwordValidation, emailValidation];
