import { SETTINGS } from '../../../src/core/settings/settings';

export const generateBasicAuthToken = (): string => {
  const credentials: string = `${SETTINGS.BASIC_AUTH_ADMIN_USERNAME}:${SETTINGS.BASIC_AUTH_ADMIN_PASSWORD}`;
  const token: string = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
};
