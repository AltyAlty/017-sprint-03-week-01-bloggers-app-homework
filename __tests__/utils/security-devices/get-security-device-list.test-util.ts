import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';
import { SecurityDeviceListOutputDTO } from '../../../src/security-devices/routes/output-dto/security-device-list.output-dto';

export const getSecurityDeviceList = async (
  app: Express,
  userAgent: string | any,
  refreshToken?: string | any,
  refreshTokenCookieString?: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean
): Promise<SecurityDeviceListOutputDTO> => {
  const testRefreshTokenCookieString: string =
    refreshTokenCookieString ?? `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`;

  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  let getSecurityDeviceListResponse;

  if (noUserAgent) {
    getSecurityDeviceListResponse = await request(app)
      .get(`${SETTINGS.SECURITY_DEVICES_PATH}${SETTINGS.GET_SECURITY_DEVICE_LIST_PATH}`)
      .set('Cookie', testRefreshTokenCookieString)
      .expect(testStatus);
  } else {
    getSecurityDeviceListResponse = await request(app)
      .get(`${SETTINGS.SECURITY_DEVICES_PATH}${SETTINGS.GET_SECURITY_DEVICE_LIST_PATH}`)
      .set('Cookie', testRefreshTokenCookieString)
      .set('User-Agent', userAgent)
      .expect(testStatus);
  }

  return getSecurityDeviceListResponse.body;
};
