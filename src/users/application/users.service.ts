import { EmailConfirmationType, UserType } from './types/user.type';
import { usersRepository } from '../repositories/users.repository';
import { CreateUserInputDTO } from '../routes/input-dto/create-user.input-dto';
import { argon2Adapter } from '../../auth/adapters/argon2.adapter';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { Result } from '../../core/types/result/result.type';
import { UserOutputDTO } from '../routes/output-dto/user.output-dto';
import { mapToUserOutputDTO } from '../repositories/mappers/map-to-user-output-dto.util';
import { commentsService } from '../../comments/application/comments.service';
import { UserDBType } from '../repositories/types/user-db.type';

/*Сервис "usersService" для работы с пользователями.*/
export const usersService = {
  /*Метод "create()" для добавления пользователя.*/
  async create(
    dto: CreateUserInputDTO,
    emailConfirmation?: EmailConfirmationType
  ): Promise<Result<{ userId: string }>> {
    /*Создаем переменные на основе параметра "dto" при помощи деструктуризации.*/
    const { login, password, email }: { login: string; password: string; email: string } = dto;
    /*Просим адаптер "argon2Adapter" сгенерировать хэш для пароля.*/
    const passwordHash: string = await argon2Adapter.generateHash(password);

    /*Создаем объект с данными нового пользователя.*/
    const newUser: UserType = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        isConfirmed: emailConfirmation?.isConfirmed ?? true,
        confirmationCode: emailConfirmation?.confirmationCode ?? '',
        expirationDate: emailConfirmation?.expirationDate ?? new Date(),
      },
    };

    /*Просим репозиторий "usersRepository" создать нового пользователя в БД.*/
    const userId: string = await usersRepository.create(newUser);

    /*Возвращаем ResultObject c ID пользователя.*/
    return {
      status: ResultStatuses.Created,
      data: { userId },
      extensions: [],
    };
  },

  /*Метод "findById()" для поиска пользователя по ID.*/
  async findById(userId: string): Promise<Result<{ userOutput: UserOutputDTO } | null>> {
    /*Просим репозиторий "usersRepository" найти пользователя по ID в БД.*/
    const userDB: UserDBType | null = await usersRepository.findById(userId);

    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!userDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'userId', message: 'Not Found' }],
      };
    }

    /*Если пользователь был найден, то преобразовываем пользователя из БД в подготовленного для отправки пользователя.*/
    const userOutput: UserOutputDTO = mapToUserOutputDTO(userDB);

    /*Возвращаем ResultObject c преобразованным пользователем.*/
    return {
      status: ResultStatuses.Ok,
      data: { userOutput },
      extensions: [],
    };
  },

  /*Метод "findByLoginOrEmail()" для поиска пользователя по логину/email.*/
  async findByLoginOrEmail(
    loginOrEmail: string
  ): Promise<Result<{ userOutputWithPasswordHash: UserOutputDTO & { passwordHash: string } } | null>> {
    /*Просим репозиторий "usersRepository" найти пользователя по логину/email в БД.*/
    const userDB: UserDBType | null = await usersRepository.findByLoginOrEmail(loginOrEmail);

    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!userDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      };
    }

    /*Если пользователь был найден, то преобразовываем пользователя из БД в подготовленного для отправки пользователя.*/
    const userOutput: UserOutputDTO = mapToUserOutputDTO(userDB);

    /*Возвращаем ResultObject c преобразованным пользователем.*/
    return {
      status: ResultStatuses.Ok,
      data: { userOutputWithPasswordHash: { ...userOutput, passwordHash: userDB.passwordHash } },
      extensions: [],
    };
  },

  /*Метод "confirmByCode()" для подтверждения регистрации пользователя по коду.*/
  async confirmByCode(code: string): Promise<Result<{} | null>> {
    /*Просим репозиторий "usersRepository" подтвердить регистрацию пользователя по коду в БД.*/
    const confirmedUserCount: number = await usersRepository.confirmByCode(code);

    /*Если пользователь не был подтвержден, то возвращаем ResultObject с информацией об этом.*/
    if (confirmedUserCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'code', message: 'Not Found' }],
      };
    }

    /*Если пользователь был подтвержден, то возвращаем ResultObject c информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод "updateEmailConfirmationByEmail()" для изменения данных для подтверждения регистрации пользователя по email.*/
  async updateEmailConfirmationByEmail(
    email: string,
    emailConfirmation: EmailConfirmationType
  ): Promise<Result<{} | null>> {
    /*Просим репозиторий "usersRepository" изменить данные для подтверждения регистрации пользователя по email в БД.*/
    const updatedUserCount: number = await usersRepository.updateEmailConfirmationByEmail(email, emailConfirmation);

    /*Если данные для подтверждения регистрации пользователя не были изменены, то возвращаем ResultObject с информацией
    об этом.*/
    if (updatedUserCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'email', message: 'Not Found' }],
      };
    }

    /*Если данные для подтверждения регистрации пользователя были изменены, то возвращаем ResultObject с информацией об
    этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод "deleteById()" для удаления пользователя по ID.*/
  async deleteById(userId: string): Promise<Result<{} | null>> {
    /*Просим сервис "commentsService" удалить комментарии пользователя по ID.*/
    await commentsService.deleteManyByUserId(userId);
    /*Просим репозиторий "usersRepository" удалить пользователя по ID в БД.*/
    const deletedUserCount: number = await usersRepository.deleteById(userId);

    /*Если пользователь не был удален, то возвращаем ResultObject с информацией об этом.*/
    if (deletedUserCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'userId', message: 'Not Found' }],
      };
    }

    /*Если пользователь был удален, то возвращаем ResultObject c информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },
};
