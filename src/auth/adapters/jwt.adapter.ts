import jwt, { SignOptions } from 'jsonwebtoken';

/*Адаптер для работы с библиотекой jsonwebtoken.*/
export const jwtAdapter = {
  /*Метод для создания AT.*/
  async createAccessToken(userId: string, secret: string, time: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const onSignComplete = (error: Error | null, token: string | undefined): void => {
        if (error) reject(error);
        else resolve(token as string);
      };

      jwt.sign({ userId }, secret, { expiresIn: time as SignOptions['expiresIn'] }, onSignComplete);
    });
  },

  /*Метод для создания RT.*/
  async createRefreshToken(userId: string, deviceId: string, secret: string, time: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const onSignComplete = (error: Error | null, token: string | undefined): void => {
        if (error) reject(error);
        else resolve(token as string);
      };

      jwt.sign({ userId, deviceId }, secret, { expiresIn: time as SignOptions['expiresIn'] }, onSignComplete);
    });
  },

  /*Метод для верификации AT.*/
  async verifyAccessToken(token: string, secret: string): Promise<{ userId: string } | null> {
    return new Promise(resolve => {
      const onVerifyComplete = (error: Error | null, decoded: unknown): void => {
        if (error) {
          // console.log('Access token verification error');
          // console.log(error);
          resolve(null);
        } else resolve(decoded as { userId: string });
      };

      jwt.verify(token, secret, onVerifyComplete);
    });
  },

  /*Метод для верификации RT.*/
  async verifyRefreshToken(token: string, secret: string): Promise<{ userId: string; deviceId: string } | null> {
    return new Promise(resolve => {
      const onVerifyComplete = (error: Error | null, decoded: unknown): void => {
        if (error) {
          // console.log('Refresh token verification error');
          // console.log(error);
          resolve(null);
        } else resolve(decoded as { userId: string; deviceId: string });
      };

      jwt.verify(token, secret, onVerifyComplete);
    });
  },

  /*Метод для декодирования RT.*/
  async decodeRefreshToken(
    token: string
  ): Promise<{ userId: string; deviceId: string; iat: number; exp: number } | null> {
    try {
      const payload: jwt.JwtPayload | string | null = jwt.decode(token);
      if (!payload || typeof payload === 'string') return null;
      if (!payload.userId || typeof payload.userId !== 'string') return null;
      if (!payload.deviceId || typeof payload.deviceId !== 'string') return null;
      if (!payload.iat || typeof payload.iat !== 'number') return null;
      if (!payload.exp || typeof payload.exp !== 'number') return null;

      return {
        userId: payload.userId,
        deviceId: payload.deviceId,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (error) {
      // console.log('Refresh token decoding error');
      // console.log(error);
      return null;
    }
  },

  /*Синхронный метод для создания AT.*/
  async createAccessTokenSync(userId: string, secret: string, time: string): Promise<string> {
    return jwt.sign({ userId }, secret, { expiresIn: time as SignOptions['expiresIn'] });
  },

  /*Синхронный метод для создания RT.*/
  async createRefreshTokenSync(userId: string, deviceId: string, secret: string, time: string): Promise<string> {
    return jwt.sign({ userId, deviceId }, secret, { expiresIn: time as SignOptions['expiresIn'] });
  },

  /*Синхронный метод для верификации AT.*/
  async verifyAccessTokenSync(token: string, secret: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, secret) as { userId: string };
    } catch (error) {
      // console.error('Access token verification error');
      // console.log(error);
      return null;
    }
  },

  /*Синхронный метод для верификации RT.*/
  async verifyRefreshTokenSync(token: string, secret: string): Promise<{ userId: string; deviceId: string } | null> {
    try {
      return jwt.verify(token, secret) as { userId: string; deviceId: string };
    } catch (error) {
      // console.error('Refresh token verification error');
      // console.log(error);
      return null;
    }
  },
};
