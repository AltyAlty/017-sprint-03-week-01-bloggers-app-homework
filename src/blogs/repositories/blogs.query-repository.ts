import { GetBlogListQueryInputDTO } from '../routes/input-dto/query/get-blog-list-query.input-dto';
import { Filter, ObjectId } from 'mongodb';
import { BlogType } from '../application/types/blog.type';
import { db } from '../../db/mongodb/mongo.db';
import { BlogSortFieldQueryInputDTO } from '../routes/input-dto/query/blog-sort-field-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { BlogDBType } from './types/blog-db.type';

/*Query-репозиторий для работы с блогами в БД.*/
export const blogsQueryRepository = {
  /*Метод для поиска блога по ID в БД.*/
  async findById(id: string): Promise<BlogDBType | null> {
    /*Просим коллекцию "blogsCollection" найти блог по ID в БД.*/
    const blog: BlogDBType | null = await db.blogsCollection.findOne({ _id: new ObjectId(id) });
    /*Если блог не был найден, то возвращаем null.*/
    if (!blog) return null;
    /*Если блог был найден, то возвращаем его.*/
    return blog;
  },

  /*Метод для поиска блогов в БД.*/
  async findAll(queryDTO: GetBlogListQueryInputDTO): Promise<{ items: BlogDBType[]; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: BlogSortFieldQueryInputDTO;
      sortDirection: SortDirection;
      searchNameTerm?: string | undefined;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<BlogType> = {};
    /*Если в query-параметрах было указано имя блога, то добавляем условие по полю "name".
    "$regex: searchNameTerm" означает поиск по шаблону - по вхождению строки. "$options: 'i'" означает, что поиск будет
    без учета регистра.*/
    if (searchNameTerm) filter.name = { $regex: searchNameTerm, $options: 'i' };

    /*Просим коллекцию "blogsCollection" найти блоги в БД:
    1. ".find(filter)": выбираем документы по собранному фильтру.
    2. ".sort({ [sortBy]: sortDirection })": сортируем по полю сортировки, которое берется динамически из переменной
    "sortBy", а направление сортировки из переменной "sortDirection".
    3. ".skip(skip)": пропускаем нужное количество записей, чтобы взять записи для запрошенной страницы.
    4. ".limit(pageSize)": берем записей не больше размера запрошенной страницы.
    5. ".toArray()": превращаем курсор в обычный массив и возвращаем его.*/
    const [items, totalCount]: [BlogDBType[], number] = await Promise.all([
      db.blogsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      /*Просим коллекцию "blogsCollection" подсчитать общее количество документов, подходящих под фильтр, без учета
      пагинации.*/
      db.blogsCollection.countDocuments(filter),
    ]);

    /*Возвращаем данные по блогам.*/
    return { items, totalCount };
  },
};
