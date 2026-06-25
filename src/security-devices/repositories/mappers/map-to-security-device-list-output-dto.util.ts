import { SecurityDeviceDBType } from '../types/security-device-db.type';
import { SecurityDeviceListOutputDTO } from '../../routes/output-dto/security-device-list.output-dto';
import { SecurityDeviceOutputDTO } from '../../routes/output-dto/security-device.output-dto';

/*Функция для преобразования устройств пользователя из БД в подготовленное для отправки клиенту устройства
пользователя.*/
export const mapToSecurityDeviceListOutputDTO = (
  securityDevices: SecurityDeviceDBType[]
): SecurityDeviceListOutputDTO => {
  return securityDevices.map(
    (securityDevice): SecurityDeviceOutputDTO => ({
      deviceId: securityDevice.deviceId,
      title: securityDevice.title,
      ip: securityDevice.ip,
      lastActiveDate: securityDevice.lastActiveDate,
    })
  );
};
