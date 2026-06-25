/*Output DTO для устройства пользователя из сессии.*/
export type SecurityDeviceOutputDTO = {
  deviceId: string;
  title: string;
  ip: string;
  lastActiveDate: Date;
};
