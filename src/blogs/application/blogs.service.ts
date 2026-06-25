import { blogsRepository } from '../repositories/blogs.repository';
import { BlogType } from './types/blog.type';
import { CreateBlogInputDTO } from '../routes/input-dto/create-blog.input-dto';
import { UpdateBlogByIdInputDTO } from '../routes/input-dto/update-blog-by-id.input-dto';
import { postsService } from '../../posts/application/posts.service';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { Result } from '../../core/types/result/result.type';
import { BlogOutputDTO } from '../routes/output-dto/blog.output-dto';
import { mapToBlogOutputDTO } from '../repositories/mappers/map-to-blog-output-dto.util';
import { BlogDBType } from '../repositories/types/blog-db.type';

/*Сервис для работы с блогами.*/
export const blogsService = {
  /*Метод для добавления блога.*/
  async create(dto: CreateBlogInputDTO): Promise<Result<{ createdBlogId: string }>> {
    /*Создаем объект с данными нового блога.*/
    const newBlog: BlogType = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    /*Просим репозиторий "blogsRepository" создать блог в БД.*/
    const createdBlogId: string = await blogsRepository.create(newBlog);

    /*Возвращаем ResultObject c ID созданного блога.*/
    return {
      status: ResultStatuses.Created,
      data: { createdBlogId },
      extensions: [],
    };
  },

  /*Метод для поиска блога по ID.*/
  async findById(id: string): Promise<Result<{ blogOutput: BlogOutputDTO } | null>> {
    /*Просим репозиторий "blogsRepository" найти блог по ID в БД.*/
    const blogDB: BlogDBType | null = await blogsRepository.findById(id);

    /*Если блог не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!blogDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Blog not found' }],
      };
    }

    /*Если блог был найден, то преобразовываем блог из БД в подготовленный для отправки клиенту блог.*/
    const blogOutput: BlogOutputDTO = mapToBlogOutputDTO(blogDB);

    /*Возвращаем ResultObject c преобразованным блогом.*/
    return {
      status: ResultStatuses.Ok,
      data: { blogOutput },
      extensions: [],
    };
  },

  /*Метод для изменения блога по ID.*/
  async updateById(id: string, dto: UpdateBlogByIdInputDTO): Promise<Result<{} | null>> {
    /*Просим репозиторий "blogsRepository" изменить блог по ID в БД.*/
    const updatedBlogCount: number = await blogsRepository.updateById(id, dto);

    /*Если блог не был изменен, то возвращаем ResultObject с информацией об этом.*/
    if (updatedBlogCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Blog not found' }],
      };
    }

    /*Если блог был изменен, то возвращаем ResultObject c информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод для удаления блога по ID.*/
  async deleteById(id: string): Promise<Result<{} | null>> {
    /*Просим репозиторий "blogsRepository" найти блог по ID в БД.*/
    const blogDB: BlogDBType | null = await blogsRepository.findById(id);

    /*Если блог не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!blogDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Blog not found' }],
      };
    }

    /*Если блог был найден, то просим сервис "postsService" удалить посты в блоге по ID.*/
    await postsService.deleteAllByBlogId(id);
    /*Просим репозиторий "blogsRepository" удалить блог по ID в БД.*/
    await blogsRepository.deleteById(id);

    /*Возвращаем ResultObject c информацией об удалении блога.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },
};
