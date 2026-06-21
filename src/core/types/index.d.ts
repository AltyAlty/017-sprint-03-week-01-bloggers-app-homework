/*В этом файле определений (definitions) расширяем тип "Request" из Express, чтобы можно было через параметр "req" при
запросах передавать свойство "userId" - данные о пользователе.*/
import { IdType } from './id.type';

/*Расширяем типы в глобальном пространстве имен.*/
declare global {
  /*Расширяем типы в пространстве имен Express.*/
  namespace Express {
    /*Расширяем интерфейс "Request" из Express. Указание "export" делает это расширение доступным вне модуля.*/
    export interface Request {
      /*Добавляем в интерфейс "Request" новое свойство "userId".*/
      userId: IdType | undefined;
    }
  }
}
