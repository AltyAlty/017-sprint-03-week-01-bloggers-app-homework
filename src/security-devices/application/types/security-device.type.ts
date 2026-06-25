/*Тип для устройства пользователя из сессии.*/
export type SecurityDeviceType = {
  deviceId: string;
  title: string;
  ip: string;
  lastActiveDate: Date;
};
