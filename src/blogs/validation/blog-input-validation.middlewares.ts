/*Импортируем метод "body()" из библиотеки express-validator, чтобы проверять тело запроса.*/
import { body } from 'express-validator';

/*Middleware "nameValidation" проверяет, что поле "name":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Состоит из не менее 1 и не более 15 символов.*/
const nameValidation = body('name')
  .exists()
  .withMessage('Field "name" is required')
  .isString()
  .withMessage('Field "name" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "name" must not be empty')
  .isLength({ min: 1, max: 15 })
  .withMessage('Field "name" must be between 1 and 15 characters');

const descriptionValidation = body('description')
  .exists()
  .withMessage('Field "description" is required')
  .isString()
  .withMessage('Field "description" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "description" must not be empty')
  .isLength({ min: 1, max: 500 })
  .withMessage('Field "description" must be between 1 and 500 characters');

/*Middleware "websiteUrlValidation" проверяет, что поле "websiteUrl":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Состоит из не менее 5 и не более 100 символов.
5. Соответствует регулярному выражению ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$.*/
const websiteUrlValidation = body('websiteUrl')
  .exists()
  .withMessage('Field "websiteUrl" is required')
  .isString()
  .withMessage('Field "websiteUrl" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "websiteUrl" must not be empty')
  .isLength({ min: 5, max: 100 })
  .withMessage('Field "websiteUrl" must be between 5 and 100 characters')
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('Field "websiteUrl" is invalid');

/*Комбинируем вышеуказанные middlewares в один middleware "blogCreateInputValidation", чтобы использовать его для
проверки запросов по созданию блога.*/
export const blogCreateInputValidation = [nameValidation, descriptionValidation, websiteUrlValidation];
/*Комбинируем вышеуказанные middlewares в один middleware "blogUpdateInputValidation", чтобы использовать его для
проверки запросов по изменению блога.*/
export const blogUpdateInputValidation = [nameValidation, descriptionValidation, websiteUrlValidation];
