/*Тип для записи в журнале лимитов запросов.*/
export type RequestRateLimitLogType = {
  ip: string;
  url: string;
  timestamp: Date;
};
