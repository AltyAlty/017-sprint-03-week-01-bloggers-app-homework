import { SecurityDeviceType } from './types/security-device.type';
import { securityDevicesRepository } from '../repositories/security-devices.repository';
import { SecurityDeviceDBType } from '../repositories/types/security-device-db.type';
import { Result } from '../../core/types/result/result.type';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { SecurityDeviceOutputDTO } from '../routes/output-dto/security-device.output-dto';
import { mapToSecurityDeviceOutputDTO } from '../repositories/mappers/map-to-security-device-output-dto.util';

/*Сервис для работы с устройствами пользователей.*/
export const securityDevicesService = {
  /*Метод для добавления устройства пользователя.*/
  async create(securityDevice: SecurityDeviceType): Promise<Result<{ createdSecurityDeviceId: string }>> {
    /*Просим репозиторий "securityDevicesRepository" добавить устройство пользователя в БД.*/
    const createdSecurityDeviceId: string = await securityDevicesRepository.create(securityDevice);

    /*Возвращаем ResultObject с ID созданного устройства пользователя.*/
    return {
      status: ResultStatuses.Created,
      data: { createdSecurityDeviceId },
      extensions: [],
    };
  },

  /*Метод для поиска устройства пользователя по ID.*/
  async findById(id: string): Promise<Result<{ securityDeviceOutput: SecurityDeviceOutputDTO } | null>> {
    /*Просим репозиторий "securityDevicesRepository" найти устройство пользователя по ID в БД.*/
    const securityDeviceDB: SecurityDeviceDBType | null = await securityDevicesRepository.findById(id);

    /*Если устройство пользователя не было найдено, то возвращаем ResultObject с информацией об этом.*/
    if (!securityDeviceDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Security device not found' }],
      };
    }

    /*Если устройство пользователя было найдено, то преобразовываем устройство пользователя из БД в подготовленное для
    отправки клиенту устройство пользователя.*/
    const securityDeviceOutput: SecurityDeviceOutputDTO = mapToSecurityDeviceOutputDTO(securityDeviceDB);

    /*Возвращаем ResultObject с преобразованным устройством пользователя.*/
    return {
      status: ResultStatuses.Ok,
      data: { securityDeviceOutput },
      extensions: [],
    };
  },

  /*Метод для изменения устройства пользователя по ID.*/
  async updateById(id: string, ip: string, lastActiveDate: Date): Promise<Result<{} | null>> {
    /*Просим репозиторий "securityDevicesRepository" изменить устройство пользователя по ID в БД.*/
    const updatedSecurityDeviceCount: number = await securityDevicesRepository.updateById(id, ip, lastActiveDate);

    /*Если устройство пользователя не было изменено, то возвращаем ResultObject с информацией об этом.*/
    if (updatedSecurityDeviceCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Security device not found' }],
      };
    }

    /*Если устройство пользователя было изменено, то возвращаем ResultObject с информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },
};
