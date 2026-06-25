import { SessionDBType } from '../types/session-db.type';
import { SessionType } from '../../application/types/session.type';
import { SessionListType } from '../../application/types/session-list.type';

/*Функция для преобразования сессий из БД в подготовленные для работы внутри приложения сессии.*/
export const mapToSessionList = (sessions: SessionDBType[]): SessionListType => {
  return sessions.map(
    (session): SessionType => ({
      userId: session.userId,
      deviceId: session.deviceId,
      deviceName: session.deviceName,
      ip: session.ip,
      iat: session.iat,
      exp: session.exp,
    })
  );
};
