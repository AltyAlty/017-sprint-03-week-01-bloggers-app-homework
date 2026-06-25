import { SecurityDeviceDBType } from '../types/security-device-db.type';
import { SecurityDeviceOutputDTO } from '../../routes/output-dto/security-device.output-dto';

/*Функция для преобразования устройства пользователя из БД в подготовленное для отправки клиенту устройство
пользователя.*/
export const mapToSecurityDeviceOutputDTO = (securityDevice: SecurityDeviceDBType): SecurityDeviceOutputDTO => {
  return {
    deviceId: securityDevice.deviceId,
    title: securityDevice.title,
    ip: securityDevice.ip,
    lastActiveDate: securityDevice.lastActiveDate,
  };
};
