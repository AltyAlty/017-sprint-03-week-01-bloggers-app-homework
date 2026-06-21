import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { db } from '../../db/mongodb/mongo.db';
import { BlogType } from '../application/types/blog.type';
import { UpdateBlogInputDTO } from '../routes/input-dto/update-blog.input-dto';
import { BlogDBType } from './types/blog-db.type';

/*Репозиторий "blogsRepository" для работы с блогами в БД.*/
export const blogsRepository = {
  /*Метод "create()" для добавления блога в БД.*/
  async create(newBlog: BlogType): Promise<string> {
    /*Просим коллекцию "blogsCollection" создать блог в БД.*/
    const insertResult: InsertOneResult<BlogType> = await db.blogsCollection.insertOne(newBlog);
    /*Возвращаем ID созданного блога.*/
    return insertResult.insertedId.toString();
  },

  /*Метод "findById()" для поиска блога по ID в БД.*/
  async findById(blogId: string): Promise<BlogDBType | null> {
    /*Просим коллекцию "blogsCollection" найти блог по ID в БД.*/
    const blog: BlogDBType | null = await db.blogsCollection.findOne({ _id: new ObjectId(blogId) });
    /*Если блог не был найден, то возвращаем null.*/
    if (!blog) return null;
    /*Если блог был найден, то возвращаем его.*/
    return blog;
  },

  /*Метод "updateById()" для изменения блога по ID в БД.*/
  async updateById(blogId: string, dto: UpdateBlogInputDTO): Promise<number> {
    /*Просим коллекцию "blogsCollection" изменить блог по ID в БД.*/
    const updateResult: UpdateResult<BlogType> = await db.blogsCollection.updateOne(
      { _id: new ObjectId(blogId) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      }
    );

    /*Возвращаем количество измененных блогов.*/
    return updateResult.matchedCount;
  },

  /*Метод "deleteById()" для удаления блога по ID в БД.*/
  async deleteById(blogId: string): Promise<number> {
    /*Просим коллекцию "blogsCollection" удалить блог по ID в БД.*/
    const deleteResult: DeleteResult = await db.blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
    /*Возвращаем количество удаленных блогов.*/
    return deleteResult.deletedCount;
  },
};
