import { body } from 'express-validator';

const contentValidation = body('content')
  .exists()
  .withMessage('Field "content" is required')
  .isString()
  .withMessage('Field "content" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "content" must not be empty')
  .isLength({ min: 20, max: 300 })
  .withMessage('Field "content" must be between 20 and 300 characters');

/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по изменению
комментария.*/
export const commentUpdateInputValidation = [contentValidation];
/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по созданию
комментария в посте.*/
export const commentInPostCreateInputValidation = [contentValidation];
