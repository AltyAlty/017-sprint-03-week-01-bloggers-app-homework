import { query } from 'express-validator';
import { SortDirection } from '../../types/pagination/sort-direction';
import { DefaultPaginationSettingsType } from '../../types/pagination/default-pagination-settings.type';
import { SETTINGS } from '../../settings/settings';

/*Объект с дефолтными настройками для пагинации.*/
export const defaultPaginationSettings: DefaultPaginationSettingsType<string> = {
  /*Дефолтный номер начальной страницы при пагинации.*/
  pageNumber: SETTINGS.DEFAULT_PAGINATION_PAGE_NUMBER,
  /*Дефолтный размер одной страницы при пагинации.*/
  pageSize: SETTINGS.DEFAULT_PAGINATION_PAGE_SIZE,
  /*Дефолтный тип сортировки при пагинации.*/
  sortBy: SETTINGS.DEFAULT_PAGINATION_SORT_BY,
  /*Дефолтное свойство, по которому будет осуществлена сортировка при пагинации.*/
  sortDirection: SETTINGS.DEFAULT_PAGINATION_SORT_DIRECTION,
};

/*Middleware "paginationValidationMiddleware" валидирует query-параметры, касающиеся пагинации:
1. "pageNumber": номер страницы должен быть строкой в виде числа, большего 0.
2. "pageSize": размер страницы должен быть строкой в виде числа из диапазона от 1 до 100.
3. "sortBy": поле сортировки данных на странице должно входить в список полей, по которым разрешена сортировка.
4. "sortDirection": тип сортировки данных на странице должен входить в список разрешенных типов сортировки.

Пример query-параметров: ?pageNumber=2&pageSize=10&sortBy=createdAt&sortDirection=asc

Касательно TS:
1. "<T extends string>": объявляется дженерик-параметр типа T, который является строкой или строковым литералом.
2. "sortFieldsEnum: Record<string, T>": указывается, что функция принимает объект, где ключи являются любыми строками,
а значения являются значениями типа T.*/
export const paginationValidationMiddleware = <T extends string>(sortFieldsEnum: Record<string, T>) => {
  /*Берем все значения из объекта "sortFieldsEnum" и формируем из них массив, обозначающий список полей, по которым
  разрешена сортировка.*/
  const allowedSortFields: string[] = Object.values(sortFieldsEnum);

  return [
    query('pageNumber')
      /*Подставляем дефолтное значение, если параметр в запросе отсутствует.*/
      .default(SETTINGS.DEFAULT_PAGINATION_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage('Field "pageNumber" must be a positive integer')
      /*Преобразовываем строку в целое число.*/
      .toInt(),

    query('pageSize')
      .default(SETTINGS.DEFAULT_PAGINATION_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Field "pageSize" must be between 1 and 100 characters')
      .toInt(),

    query('sortBy')
      .default(Object.values(sortFieldsEnum)[0])
      /*Проверяем, что указанный query-параметр "sortBy", входит в список полей, по которым разрешена сортировка.*/
      .isIn(allowedSortFields)
      .withMessage(`Field "sortBy" must be: ${allowedSortFields.join(', ')}`),

    query('sortDirection')
      .default(SETTINGS.DEFAULT_PAGINATION_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(`Field "sortDirection" must be: ${Object.values(SortDirection).join(', ')}`),

    // /api/blogs?pageSize=5&pageNumber=1&searchNameTerm=Tim&sortDirection=asc&sortBy=name
    query('searchNameTerm').optional(),
    query('searchLoginTerm').optional(),
    query('searchEmailTerm').optional(),
  ];
};
