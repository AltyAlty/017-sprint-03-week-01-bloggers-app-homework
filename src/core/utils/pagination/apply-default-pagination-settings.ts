import { defaultPaginationSettings } from '../../middlewares/validation/pagination-validation.middleware';
import { DefaultPaginationSettingsType } from '../../types/pagination/default-pagination-settings.type';

/*Функция "applyDefaultPaginationSettings()" на основе объекта с query-параметрами, прошедшими обработку через функцию
"matchedData()", создает новый объект, который соответствует типу "defaultPaginationSettings". То есть эта функция
добавляет дефолтные настройки пагинации.

Касательно TS:
1. "<P = string>": можно указать дженерик-параметр, если не указывать, то он будет равен string.
2. "query: Partial<DefaultPaginationSettingsType<P>>": параметр "query" может быть содержать поля типа
"DefaultPaginationSettingsType", а может быть вообще пустым объектом.
3. ": DefaultPaginationSettingsType<P>": на выходе функция возвращает полный объект типа
"DefaultPaginationSettingsType".*/
export const applyDefaultPaginationSettings = <P = string>(
  query: Partial<DefaultPaginationSettingsType<P>>
): DefaultPaginationSettingsType<P> => {
  return {
    ...defaultPaginationSettings,
    ...query,
    sortBy: (query.sortBy ?? defaultPaginationSettings.sortBy) as P,
  };
};
