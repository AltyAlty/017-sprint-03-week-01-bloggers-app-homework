import { UpdateCommentByIdInputDTO } from '../routes/input-dto/update-comment-by-id.input-dto';
import { db } from '../../db/mongodb/mongo.db';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { CommentType } from '../application/types/comment.type';
import { CommentDBType } from './types/comment-db.type';

/*Репозиторий для работы с комментариями в БД.*/
export const commentsRepository = {
  /*Метод для добавления комментария в БД.*/
  async create(newComment: CommentType): Promise<string> {
    /*Просим коллекцию "commentsCollection" создать комментарий в БД.*/
    const insertResult: InsertOneResult<CommentType> = await db.commentsCollection.insertOne(newComment);
    /*Возвращаем ID созданного комментария.*/
    return insertResult.insertedId.toString();
  },

  /*Метод для поиска комментария по ID в БД.*/
  async findById(id: string): Promise<CommentDBType | null> {
    /*Просим коллекцию "commentsCollection" найти комментарий по ID в БД.*/
    const comment: CommentDBType | null = await db.commentsCollection.findOne({ _id: new ObjectId(id) });
    /*Если комментарий не был найден, то возвращаем null.*/
    if (!comment) return null;
    /*Если комментарий был найден, то возвращаем его.*/
    return comment;
  },

  /*Метод для изменения комментария по ID в БД.*/
  async updateById(id: string, dto: UpdateCommentByIdInputDTO): Promise<number> {
    /*Просим коллекцию "commentsCollection" изменить комментарий по ID в БД.*/
    const updateResult: UpdateResult<CommentType> = await db.commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content: dto.content } }
    );

    /*Возвращаем количество измененных комментариев.*/
    return updateResult.matchedCount;
  },

  /*Метод для удаления комментария по ID в БД.*/
  async deleteById(id: string): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарий по ID в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteOne({ _id: new ObjectId(id) });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },

  /*Метод для удаления комментариев по ID поста в БД.*/
  async deleteAllByPostId(postId: string): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарии по ID поста в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteMany({ postId });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },

  /*Метод для удаления комментариев по ID пользователя в БД.*/
  async deleteAllByUserId(userId: string): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарии по ID пользователя в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteMany({ 'commentatorInfo.userId': userId });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },

  /*Метод для удаления комментариев по ID постов в БД.*/
  async deleteAllByPostIds(postIds: string[]): Promise<number> {
    /*Просим коллекцию "commentsCollection" удалить комментарии по ID постов в БД.*/
    const deleteResult: DeleteResult = await db.commentsCollection.deleteMany({ postId: { $in: postIds } });
    /*Возвращаем количество удаленных комментариев.*/
    return deleteResult.deletedCount;
  },
};
