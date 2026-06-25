import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { db } from '../../db/mongodb/mongo.db';
import { BlogType } from '../application/types/blog.type';
import { UpdateBlogByIdInputDTO } from '../routes/input-dto/update-blog-by-id.input-dto';
import { BlogDBType } from './types/blog-db.type';

/*Репозиторий для работы с блогами в БД.*/
export const blogsRepository = {
  /*Метод для добавления блога в БД.*/
  async create(newBlog: BlogType): Promise<string> {
    /*Просим коллекцию "blogsCollection" создать блог в БД.*/
    const insertResult: InsertOneResult<BlogType> = await db.blogsCollection.insertOne(newBlog);
    /*Возвращаем ID созданного блога.*/
    return insertResult.insertedId.toString();
  },

  /*Метод для поиска блога по ID в БД.*/
  async findById(id: string): Promise<BlogDBType | null> {
    /*Просим коллекцию "blogsCollection" найти блог по ID в БД.*/
    const blog: BlogDBType | null = await db.blogsCollection.findOne({ _id: new ObjectId(id) });
    /*Если блог не был найден, то возвращаем null.*/
    if (!blog) return null;
    /*Если блог был найден, то возвращаем его.*/
    return blog;
  },

  /*Метод для изменения блога по ID в БД.*/
  async updateById(id: string, dto: UpdateBlogByIdInputDTO): Promise<number> {
    /*Просим коллекцию "blogsCollection" изменить блог по ID в БД.*/
    const updateResult: UpdateResult<BlogType> = await db.blogsCollection.updateOne(
      { _id: new ObjectId(id) },
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
  async deleteById(id: string): Promise<number> {
    /*Просим коллекцию "blogsCollection" удалить блог по ID в БД.*/
    const deleteResult: DeleteResult = await db.blogsCollection.deleteOne({ _id: new ObjectId(id) });
    /*Возвращаем количество удаленных блогов.*/
    return deleteResult.deletedCount;
  },
};
