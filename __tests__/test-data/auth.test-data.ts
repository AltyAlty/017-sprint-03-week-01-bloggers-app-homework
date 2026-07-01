import { jwtAdapter } from '../../src/auth/adapters/jwt.adapter';
import { SETTINGS } from '../../src/core/settings/settings';
import { invalidUserIds } from './users.test-data';
import { invalidDeviceIds } from './security-devices.test-data';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';

export const invalidBasicAuthTokens = {
  BAT_01: 'token',
};

export const validAccessTokens = {
  AT_01: jwtAdapter.createAccessTokenSync(new ObjectId().toString(), SETTINGS.AT_SECRET!, SETTINGS.AT_TIME!),
};

export const invalidAccessTokens = {
  AT_01: '',
  AT_02: '   ',
  AT_03: 'token',
  AT_04: 2,
  AT_05: null,
  AT_06: undefined,
  AT_07: [],
  AT_08: {},
  AT_09: jwtAdapter.createAccessTokenSync(invalidUserIds.id_01, SETTINGS.AT_SECRET!, SETTINGS.AT_TIME!),
};

export const validRefreshTokens = {
  RT_01: jwtAdapter.createRefreshTokenSync(
    new ObjectId().toString(),
    new ObjectId().toString(),
    SETTINGS.RT_SECRET!,
    SETTINGS.RT_TIME!
  ),
};

export const invalidRefreshTokens = {
  RT_01: '',
  RT_02: '   ',
  RT_03: 'token',
  RT_04: 2,
  RT_05: null,
  RT_06: undefined,
  RT_07: [],
  RT_08: {},

  RT_09: jwtAdapter.createRefreshTokenSync(
    invalidUserIds.id_01,
    invalidDeviceIds.id_01,
    SETTINGS.RT_SECRET!,
    SETTINGS.RT_TIME!
  ),
};

export const invalidConfirmationCodes = {
  code_01: '',
  code_02: '   ',
  code_03: '0123456789111111',
  code_04: '!@#$%^&*()',
  code_05: 'ab',
  code_06: null,
  code_07: undefined,
  code_08: 1234567890,
};

export const validUserAgents = {
  userAgent_01: 'test-user-agent',
};

export const invalidUserAgents = {
  userAgent_01: '',
  userAgent_02: '   ',
};

export const validUUIDRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validUUIDs = {
  uuid_01: '11111111-1111-1111-1111-111111111111',
};

export const expiredUserEmailConfirmationData = {
  isConfirmed: false,
  confirmationCode: randomUUID(),
  expirationDate: add(new Date(), { seconds: -1 }),
};
