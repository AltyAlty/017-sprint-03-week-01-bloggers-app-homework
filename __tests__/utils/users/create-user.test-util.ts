import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { getCreateUserInputDTO } from './get-create-user-input-dto.test-util';

export const createUser = async (
  app: Express,
  userDTO?: CreateUserInputDTO | any,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<UserOutputDTO> => {
  const testCreateUserData: CreateUserInputDTO = { ...getCreateUserInputDTO(), ...userDTO };
  const testStatus = expectedStatus ?? HttpStatuses.Created_201;
  const testBasicAuthToken = basicAuthToken ?? generateBasicAuthToken();

  const createUserResponse = await request(app)
    .post(`${SETTINGS.USERS_PATH}${SETTINGS.CREATE_USER_PATH}`)
    .set('Authorization', testBasicAuthToken)
    .send(testCreateUserData)
    .expect(testStatus);

  return createUserResponse.body;
};
