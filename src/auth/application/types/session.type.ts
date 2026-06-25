/*Тип для сессии.*/
export type SessionType = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat: Date;
  exp: Date;
};
