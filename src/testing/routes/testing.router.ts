import { Router } from 'express';
import { clearDbHandler } from './handlers/clear-db.handler';
import { SETTINGS } from '../../core/settings/settings';

/*Роутер из Express для тестирования приложения.*/
export const testingRouter = Router({});

/*Конфигурируем роутер "testingRouter".*/
testingRouter
  /*DELETE-запрос по очистке БД для целей тестирования.*/
  .delete(SETTINGS.CLEAR_DB_PATH, clearDbHandler);
