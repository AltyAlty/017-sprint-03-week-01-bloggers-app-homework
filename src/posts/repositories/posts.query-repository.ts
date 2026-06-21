import { Filter, ObjectId } from 'mongodb';
import { PostType } from '../application/types/post.type';
import { db } from '../../db/mongodb/mongo.db';
import { GetPostListQueryInputDTO } from '../routes/input-dto/get-post-list-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { PostSortFieldInputDTO } from '../routes/input-dto/post-sort-field.input-dto';
import { PostDBType } from './types/post-db.type';

/*Query-репозиторий "postsQueryRepository" для работы с постами в БД.*/
export const postsQueryRepository = {
  /*Метод "findById()" для поиска поста по ID в БД.*/
  async findById(postId: string): Promise<PostDBType | null> {
    /*Просим коллекцию "postsCollection" найти пост по ID в БД.*/
    const result: PostDBType | null = await db.postsCollection.findOne({ _id: new ObjectId(postId) });
    /*Если пост не был найден, то возвращаем null.*/
    if (!result) return null;
    /*Если пост был найден, то возвращаем его.*/
    return result;
  },

  /*Метод "findMany()" для поиска постов в БД.*/
  async findMany(
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
      sortBy: PostSortFieldInputDTO;
      sortDirection: SortDirection;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<PostType> = {};
    /*Если был указан ID блога, то добавляем его в фильтр.*/
    if (blogId) filter.blogId = { $regex: blogId, $options: 'i' };

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
