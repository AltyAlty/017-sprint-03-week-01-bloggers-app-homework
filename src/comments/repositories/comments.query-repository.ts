import { Filter, ObjectId } from 'mongodb';
import { CommentType } from '../application/types/comment.type';
import { db } from '../../db/mongodb/mongo.db';
import { GetCommentListByPostIdQueryInputDTO } from '../routes/input-dto/query/get-comment-list-by-post-id-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { CommentSortFieldQueryInputDTO } from '../routes/input-dto/query/comment-sort-field-query.input-dto';
import { CommentDBType } from './types/comment-db.type';

/*Query-репозиторий для работы с комментариями в БД.*/
export const commentsQueryRepository = {
  /*Метод для поиска комментария по ID в БД.*/
  async findById(id: string): Promise<CommentDBType | null> {
    /*Просим коллекцию "commentsCollection" найти комментарий по ID в БД.*/
    const comment: CommentDBType | null = await db.commentsCollection.findOne({ _id: new ObjectId(id) });
    /*Если комментарий не был найден, то возвращаем null.*/
    if (!comment) return null;
    /*Если комментарий был найден, то возвращаем его.*/
    return comment;
  },

  /*Метод для поиска комментариев по ID поста в БД.*/
  async findAllByPostId(
    postId: string,
    queryDTO: GetCommentListByPostIdQueryInputDTO
  ): Promise<{ items: CommentDBType[]; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: CommentSortFieldQueryInputDTO;
      sortDirection: SortDirection;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<CommentType> = {};
    /*Добавляем в фильтр ID поста.*/
    filter.postId = postId;

    /*Просим коллекцию "commentsCollection" найти комментарии в посте по ID в БД и подсчитать общее количество
    документов, подходящих под фильтр, без учета пагинации.*/
    const [items, totalCount]: [CommentDBType[], number] = await Promise.all([
      db.commentsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      db.commentsCollection.countDocuments(filter),
    ]);

    /*Возвращаем данные по комментариям.*/
    return { items, totalCount };
  },
};
