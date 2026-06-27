import { Filter, ObjectId } from 'mongodb';
import { PostType } from '../application/types/post.type';
import { db } from '../../db/mongodb/mongo.db';
import { GetPostListQueryInputDTO } from '../routes/input-dto/query/get-post-list-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { PostSortFieldQueryInputDTO } from '../routes/input-dto/query/post-sort-field-query.input-dto';
import { PostDBType } from './types/post-db.type';

/*Query-репозиторий для работы с постами в БД.*/
export const postsQueryRepository = {
  /*Метод для поиска поста по ID в БД.*/
  async findById(id: string): Promise<PostDBType | null> {
    /*Просим коллекцию "postsCollection" найти пост по ID в БД.*/
    const result: PostDBType | null = await db.postsCollection.findOne({ _id: new ObjectId(id) });
    /*Если пост не был найден, то возвращаем null.*/
    if (!result) return null;
    /*Если пост был найден, то возвращаем его.*/
    return result;
  },

  /*Метод для поиска постов в БД.*/
  async findAll(
    queryDTO: GetPostListQueryInputDTO,
    blogId?: string
  ): Promise<{ items: PostDBType[]; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: PostSortFieldQueryInputDTO;
      sortDirection: SortDirection;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<PostType> = {};
    /*Если был указан ID блога, то добавляем его в фильтр.*/
    if (blogId) filter.blogId = blogId;

    /*Просим коллекцию "postsCollection" найти посты в БД и подсчитать общее количество документов, подходящих под
    фильтр, без учета пагинации.*/
    const [items, totalCount]: [PostDBType[], number] = await Promise.all([
      db.postsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      db.postsCollection.countDocuments(filter),
    ]);

    /*Возвращаем данные по постам.*/
    return { items, totalCount };
  },
};
