import { body, ValidationChain } from 'express-validator';

export const titleValidation: ValidationChain = body('title')
  .exists()
  .withMessage('Field "title" is required')
  .isString()
  .withMessage('Field "title" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "title" must not be empty')
  .isLength({ min: 1, max: 30 })
  .withMessage('Field "title" must be between 1 and 30 characters');

export const shortDescriptionValidation: ValidationChain = body('shortDescription')
  .exists()
  .withMessage('Field "shortDescription" is required')
  .isString()
  .withMessage('Field "shortDescription" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "shortDescription" must not be empty')
  .isLength({ min: 1, max: 100 })
  .withMessage('Field "shortDescription" must be between 1 and 100 characters');

export const contentValidation: ValidationChain = body('content')
  .exists()
  .withMessage('Field "content" is required')
  .isString()
  .withMessage('Field "content" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "content" must not be empty')
  .isLength({ min: 1, max: 1000 })
  .withMessage('Field "content" must be between 1 and 1000 characters');

/*Middleware для проверки, что поле "blogId":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Соответствует формату ObjectId.*/
export const blogIdValidation: ValidationChain = body('blogId')
  .exists()
  .withMessage('Field "blogId" is required')
  .isString()
  .withMessage('Field "blogId" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "blogId" must not be empty')
  .isMongoId()
  .withMessage('Field "blogId" must be an ObjectId');

/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по созданию
поста.*/
export const postCreateInputValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по изменению
поста.*/
export const postUpdateInputValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по созданию поста
в блоге.*/
export const postInBlogCreateInputValidation = [titleValidation, shortDescriptionValidation, contentValidation];
