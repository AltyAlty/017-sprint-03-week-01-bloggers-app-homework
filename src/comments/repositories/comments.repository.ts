import { UpdateCommentInputDTO } from '../routes/input-dto/update-comment.input-dto';
import { db } from '../../db/mongodb/mongo.db';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { CommentType } from '../application/types/comment.type';
import { CommentDBType } from './types/comment-db.type';

/*Репозиторий "commentsRepository" для работы с комментариями в БД.*/
export const commentsRepository = {
  /*Метод "create()" для добавления комментария в БД.*/
  async create(newComment: CommentType): Promise<string> {
    /*Просим коллекцию "commentsCollection" создать комментарий в БД.*/
    const insertResult: InsertOneResult<CommentType> = await db.commentsCollection.insertOne(newComment);
    /*Возвращаем ID созданного комментария.*/
    return insertResult.insertedId.toString();
  },

  /*Метод "findById()" для поиска комментария по ID в БД.*/
  async findById(commentId: string): Promise<CommentDBType | null> {
    /*Просим коллекцию "commentsCollection" найти комментарий по ID в БД.*/
    const comment: CommentDBType | null = await db.commentsCollection.findOne({ _id: new ObjectId(commentId) });
    /*Если комментарий не был найден, то возвращаем null.*/
    if (!comment) return null;
    /*Если комментарий был найден, то возвращаем его.*/
    return comment;
  },

  /*Метод "findAllByPostId()" для поиска комментариев в посте по ID в БД.*/
  async findAllByPostId(postId: string): Promise<CommentDBType[] | null> {
    /*Просим коллекцию "commentsCollection" найти комментарии в посте по ID в БД.*/
    const comments: CommentDBType[] = await db.commentsCollection.find({ postId: postId }).toArray();
    /*Если комментариев не было найдено, то возвращаем null.*/
    if (!comments || comments.length === 0) return null;
    /*Если комментарии были найдены, то возвращаем их.*/
    return comments;
  },

  /*Метод "findAllByUserId()" для поиска комментариев пользователя по ID в БД.*/
  async findAllByUserId(userId: string): Promise<CommentDBType[] | null> {
    /*Просим коллекцию "commentsCollection" найти комментарии пользователя по ID в БД.*/
    const comments: CommentDBType[] = await db.commentsCollection.find({ 'commentatorInfo.userId': userId }).toArray();
    /*Если комментариев не было найдено, то возвращаем null.*/
    if (!comments || comments.length === 0) return null;
    /*Если комментарии были найдены, то возвращаем их.*/
    return comments;
  },

  /*Метод "updateById()" для изменения комментария по ID в БД.*/
  async updateById(commentId: string, dto: UpdateCommentInputDTO): Promise<number> {
    /*Просим коллекцию "commentsCollection" изменить комментарий по ID в БД.*/
    const updateResult: UpdateResult<CommentType> = await db.commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content: dto.content } }
    );

    /*Возвращаем количество измененных комментариев.*/
    return updateResult.matchedCount;
  },

  /*Метод "deleteById()" для удаления комментария по ID в БД.*/
  async deleteById(commentId: string): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарий по ID в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteOne({ _id: new ObjectId(commentId) });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },

  /*Метод "deleteManyByPostId()" для удаления комментариев в посте по ID в БД.*/
  async deleteManyByPostId(postId: string): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарии в посте по ID в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteMany({ postId });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },

  /*Метод "deleteManyByUserId()" для удаления комментариев пользователя по ID в БД.*/
  async deleteManyByUserId(userId: string): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарии пользователя по ID в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteMany({ 'commentatorInfo.userId': userId });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },

  /*Метод "deleteManyByPostIds()" для удаления комментариев в постах по ID в БД.*/
  async deleteManyByPostIds(postIds: string[]): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарии в постах по ID в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteMany({ postId: { $in: postIds } });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },
};
