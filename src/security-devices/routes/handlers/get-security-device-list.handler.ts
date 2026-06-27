import { Request, Response } from 'express';
import { ExtensionType, Result } from '../../../core/types/result/result.type';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { SecurityDeviceListOutputDTO } from '../output-dto/security-device-list.output-dto';
import { mapResultCodeToHttpStatus } from '../../../core/utils/result/mappers/map-result-code-to-http-status';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { securityDevicesQueryService } from '../../application/security-devices.query-service';

/*Функция-обработчик для GET-запросов по получению устройств пользователя в активных сессиях.*/
export const getSecurityDeviceListHandler = async (
  req: Request,
  res: Response<SecurityDeviceListOutputDTO | ExtensionType[]>
): Promise<void | Response<SecurityDeviceListOutputDTO | ExtensionType[]>> => {
  try {
    /*Получаем ID пользователя.*/
    const userId: string = req.userId!.id;

    /*Просим query-сервис "securityDevicesQueryService" найти устройства пользователя по ID пользователя.*/
    const securityDevicesResult: Result<{ securityDeviceListOutput: SecurityDeviceListOutputDTO } | null> =
      await securityDevicesQueryService.findAllByUserId(userId);

    /*Получаем HTTP-статус операции по поиску устройств пользователя по ID пользователя.*/
    const securityDevicesResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(securityDevicesResult.status);

    /*Если устройства пользователя не были найдены, то сообщаем об этом клиенту.*/
    if (securityDevicesResultHttpStatus !== HttpStatuses.Ok_200) {
      return res.status(securityDevicesResultHttpStatus).send(securityDevicesResult.extensions);
    }

    /*Если устройства пользователя были найдены, то отправляем их клиенту.*/
    return res.status(securityDevicesResultHttpStatus).send(securityDevicesResult.data!.securityDeviceListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    return errorsHandler(error, res);
  }
};
