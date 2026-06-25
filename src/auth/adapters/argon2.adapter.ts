import * as argon2 from '@node-rs/argon2';
import { Algorithm, Version } from '@node-rs/argon2';

/*Адаптер для работы с библиотекой @node-rs/argon2.*/
export const argon2Adapter = {
  /*Метод для генерации хеша для паролей.*/
  async generateHash(password: string): Promise<string> {
    return argon2.hash(password, {
      memoryCost: 65536,
      timeCost: 3,
      outputLen: 32,
      parallelism: 4,
      algorithm: Algorithm.Argon2id,
      version: Version.V0x13,
    });
  },

  /*Метод для проверки валидности пароля по хэшу.*/
  async checkPassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  },
};
