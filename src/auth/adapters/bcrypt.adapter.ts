import bcrypt from 'bcrypt';

/*Адаптер для работы с библиотекой bcrypt.*/
export const bcryptAdapter = {
  /*Метод для генерации хеша для паролей.*/
  async generateHash(password: string): Promise<string> {
    /*Генерируем хэш-соль. В качестве параметра для генерации хэш-соли указываем количество раундов, что является
    степенью для цифры 2.*/
    const salt: string = await bcrypt.genSalt(10);
    /*Хэшируем пароль на основе пароля и хэш-соли.*/
    return bcrypt.hash(password, salt);
  },

  /*Метод для проверки валидности пароля по хэшу.*/
  async checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
