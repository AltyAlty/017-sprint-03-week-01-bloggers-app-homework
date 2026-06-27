/*Импортируем метод "param()" из библиотеки express-validator, чтобы проверять ID.*/
import { param, ValidationChain } from 'express-validator';

export const idValidation: ValidationChain = param('id')
  .exists()
  .withMessage('Field "id" is required')
  .isString()
  .withMessage('Field "id" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "id" must not be empty')
  .isMongoId()
  .withMessage('Field "id" must be an ObjectId');

export const blogIdValidation: ValidationChain = param('blogId')
  .exists()
  .withMessage('Field "blogId" is required')
  .isString()
  .withMessage('Field "blogId" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "blogId" must not be empty')
  .isMongoId()
  .withMessage('Field "blogId" must be an ObjectId');

export const postIdValidation: ValidationChain = param('postId')
  .exists()
  .withMessage('Field "postId" is required')
  .isString()
  .withMessage('Field "postId" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "postId" must not be empty')
  .isMongoId()
  .withMessage('Field "postId" must be an ObjectId');
