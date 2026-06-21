/*Output DTO для сообщений об ошибках валидации, отправляемых клиенту.*/
export type ValidationErrorOutputDTO = {
  field: string;
  message: string;
};
