import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { PaginatedUserListOutputDTO } from '../../../src/users/routes/output-dto/paginated-user-list.output-dto';

export const getUserList = async (
  app: Express,
  urlWithPagination?: string,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<PaginatedUserListOutputDTO> => {
  const url = urlWithPagination ?? `${SETTINGS.USERS_PATH}${SETTINGS.GET_USERS_LIST_PATH}`;
  const testStatus = expectedStatus ?? HttpStatuses.Ok_200;
  const testBasicAuthToken = basicAuthToken ?? generateBasicAuthToken();
  const getUserListResponse = await request(app).get(url).set('Authorization', testBasicAuthToken).expect(testStatus);
  return getUserListResponse.body;
};
