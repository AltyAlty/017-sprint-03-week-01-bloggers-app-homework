import bcrypt from 'bcrypt';

/*Адаптер для работы с библиотекой bcrypt.*/
export const bcryptAdapter = {
  /*Метод для генерации хеша пароля.*/
  async generatePasswordHash(password: string): Promise<string> {
    /*Генерируем хеш-соль. В качестве параметра для генерации хеш-соли указываем количество раундов, что является
    степенью двойки.*/
    const salt: string = await bcrypt.genSalt(10);
    /*Хешируем пароль, используя хеш-соль.*/
    return bcrypt.hash(password, salt);
  },

  /*Метод для проверки валидности пароля по хешу.*/
  async checkPasswordByHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
