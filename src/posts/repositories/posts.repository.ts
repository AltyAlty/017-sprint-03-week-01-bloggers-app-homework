import { db } from '../../db/mongodb/mongo.db';
import { PostType } from '../application/types/post.type';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { UpdatePostByIdInputDTO } from '../routes/input-dto/update-post-by-id.input-dto';
import { PostDBType } from './types/post-db.type';

/*Репозиторий для работы с постами в БД.*/
export const postsRepository = {
  /*Метод для добавления поста в БД.*/
  async create(newPost: PostType): Promise<string> {
    /*Просим коллекцию "postsCollection" создать пост в БД.*/
    const insertResult: InsertOneResult<PostType> = await db.postsCollection.insertOne(newPost);
    /*Возвращаем ID созданного поста.*/
    return insertResult.insertedId.toString();
  },

  /*Метод для поиска поста по ID в БД.*/
  async findById(id: string): Promise<PostDBType | null> {
    /*Просим коллекцию "postsCollection" найти пост по ID в БД.*/
    const post: PostDBType | null = await db.postsCollection.findOne({ _id: new ObjectId(id) });
    /*Если пост не был найден, то возвращаем null.*/
    if (!post) return null;
    /*Если пост был найден, то возвращаем его.*/
    return post;
  },

  /*Метод для поиска постов по ID блога в БД.*/
  async findAllByBlogId(blogId: string): Promise<PostDBType[] | null> {
    /*Просим коллекцию "postsCollection" найти посты по ID блога в БД.*/
    const posts: PostDBType[] = await db.postsCollection.find({ blogId }).toArray();
    /*Если постов не было найдено, то возвращаем null.*/
    if (!posts || posts.length === 0) return null;
    /*Если посты были найдены, то возвращаем их.*/
    return posts;
  },

  /*Метод для изменения поста по ID в БД.*/
  async updateById(id: string, dto: UpdatePostByIdInputDTO): Promise<number> {
    /*Просим коллекцию "postsCollection" изменить пост по ID в БД.*/
    const updateResult: UpdateResult<PostType> = await db.postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      }
    );

    /*Возвращаем количество постов, попавших под фильтр.*/
    return updateResult.matchedCount;
  },

  /*Метод для удаления поста по ID в БД.*/
  async deleteById(id: string): Promise<number> {
    /*Просим коллекцию "postsCollection" удалить пост по ID в БД.*/
    const deleteResult: DeleteResult = await db.postsCollection.deleteOne({ _id: new ObjectId(id) });
    /*Возвращаем количество удаленных постов.*/
    return deleteResult.deletedCount;
  },

  /*Метод для удаления постов по ID блога в БД.*/
  async deleteAllByBlogId(blogId: string): Promise<number> {
    /*Просим коллекцию "postsCollection" удалить посты в блоге по ID в БД.*/
    const deleteResult: DeleteResult = await db.postsCollection.deleteMany({ blogId });
    /*Возвращаем количество удаленных постов.*/
    return deleteResult.deletedCount;
  },
};
