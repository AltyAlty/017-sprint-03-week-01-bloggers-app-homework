import jwt, { SignOptions } from 'jsonwebtoken';

/*Адаптер "jwtAdapter" для работы с библиотекой jsonwebtoken.*/
export const jwtAdapter = {
  /*Метод "createToken()" для создания JWT.*/
  async createToken(userId: string, secret: string, time: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const onSignComplete = (error: Error | null, token: string | undefined): void => {
        if (error) reject(error);
        else resolve(token as string);
      };

      jwt.sign({ userId }, secret, { expiresIn: time as SignOptions['expiresIn'] }, onSignComplete);
    });
  },

  /*Метод "verifyToken()" для верификации JWT.*/
  async verifyToken(token: string, secret: string): Promise<{ userId: string } | null> {
    return new Promise(resolve => {
      const onVerifyComplete = (error: Error | null, decoded: unknown): void => {
        if (error) {
          console.log('Token verification error');
          console.log(error);
          resolve(null);
        } else resolve(decoded as { userId: string });
      };

      jwt.verify(token, secret, onVerifyComplete);
    });
  },

  /*Синхронный метод "createTokenSync()" для создания JWT.*/
  async createTokenSync(userId: string, secret: string, time: string): Promise<string> {
    return jwt.sign({ userId }, secret, { expiresIn: time as SignOptions['expiresIn'] });
  },

  /*Синхронный метод "verifyTokenSync()" для верификации JWT.*/
  async verifyTokenSync(token: string, secret: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, secret) as { userId: string };
    } catch (error) {
      console.error('Token verification error');
      console.log(error);
      return null;
    }
  },
};
