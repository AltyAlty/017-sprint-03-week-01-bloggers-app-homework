import { Request } from 'express';
import { matchedData } from 'express-validator';
import { applyDefaultPaginationSettings } from './apply-default-pagination-settings';
import { DefaultPaginationSettingsType } from '../../types/pagination/default-pagination-settings.type';

/*Функция "getSanitizedQueryInputWithDefaultPaginationSettings()" извлекает и санитизирует query-параметры при помощи
функции "matchedData()" из библиотеки express-validator, после чего применяет к ним дефолтные настройки пагинации,
возвращая полностью заполненный объект типа "DefaultPaginationSettingsType<P>".

Касательно ТС:
1. Дженерик T уточняет изначальные query-параметры.
2. Дженерик P уточняет разрешенные значения query-параметра "sortBy" для сортировки данных на странице при пагинации.
3. Функция "matchedData()" ожидает Request с типом query-параметров "ParsedQs", где все значения являются строками или
массивами строк, а мы будем передавать типы, где поля "pageNumber" и "pageSize" будут числами. Поэтому типизируем
параметр "req", как "Request" с указанием, что query-параметры могут быть любого типа.*/
export const getSanitizedQueryInputWithDefaultPaginationSettings = <T extends object, P = string>(
  req: Request<{}, {}, {}, T>
): DefaultPaginationSettingsType<P> => {
  /*Функция "matchedData()" берет из объекта "req" только те поля, которые ранее прошли через валидаторы/санитайзеры на
  основе библиотеки express-validator.*/
  const sanitizedQueryInput = matchedData<T>(req, {
    /*Берем данные только из объекта "req.query".*/
    locations: ['query'],
    /*Включаем опциональные поля, то есть те, для которых в валидаторах использовался метод "optional()", даже если
    они не приходили в запросе или были пропущены.*/
    includeOptionals: true,
  });

  /*Добавляем к объекту с query-параметрами поля с дефолтными данными для пагинации.*/
  return applyDefaultPaginationSettings<P>(sanitizedQueryInput);
};
