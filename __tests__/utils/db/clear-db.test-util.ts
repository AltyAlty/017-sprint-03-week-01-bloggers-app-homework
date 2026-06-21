import request from 'supertest';
import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';

export const clearDb = async (app: Express) => {
  await request(app).delete(`${SETTINGS.TESTING_PATH}${SETTINGS.CLEAR_DB_PATH}`).expect(HttpStatuses.NoContent_204);
  return;
};
