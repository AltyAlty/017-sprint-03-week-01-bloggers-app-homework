import 'dotenv/config';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { nodemailerAdapter } from '../../../src/auth/adapters/nodemailer.adapter';
import { authService } from '../../../src/auth/application/auth.service';
import { ResultStatuses } from '../../../src/core/types/result/result-statuses';
import { PaginatedUserListOutputDTO } from '../../../src/users/routes/output-dto/paginated-user-list.output-dto';
import { getUserList } from '../../utils/users/get-user-list.test-util';
import { emailExamples } from '../../../src/auth/email/email-examples';
import { usersRepository } from '../../../src/users/repositories/users.repository';
import { UserDBType } from '../../../src/users/repositories/types/user-db.type';
import { confirmUserByCode } from '../../utils/auth/confirm-user-by-code.test-util';
import { Result } from '../../../src/core/types/result/result.type';
import { createMockEmailAdapter } from '../../test-doubles/mocks';
import {
  createUsersServiceConfirmByCodeSpy,
  createUsersServiceCreateSpy,
  createUsersServiceUpdateEmailConfirmationByEmailSpy,
} from '../../test-doubles/spies';

describe('Auth', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should register a user when a valid body passed; POST /api/auth/registration', async () => {
    const mockEmailAdapter: jest.Mocked<typeof nodemailerAdapter> = createMockEmailAdapter();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();

    const registerUserResult: Result<{ createdUserId: string }> = await authService.registerUser(
      createUserData,
      mockEmailAdapter
    );

    const getUserListResponse: PaginatedUserListOutputDTO = await getUserList(app);
    expect(registerUserResult.status).toBe(ResultStatuses.Created);
    expect(typeof registerUserResult.data.createdUserId).toBe('string');
    expect(registerUserResult.extensions).toBeInstanceOf(Array);
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Complete Registration',
      expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      emailExamples.completeRegistrationEmail
    );

    expect(getUserListResponse.items).toBeInstanceOf(Array);
    expect(getUserListResponse.items.length).toBe(1);
    expect(getUserListResponse.totalCount).toBe(1);
    expect(getUserListResponse.items[0].login).toEqual(createUserData.login);
    expect(getUserListResponse.items[0].email).toEqual(createUserData.email);

    /*Приводим шпионов в изначальное состояния для использования их в других тестах.*/
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('✅ 002 should confirm user registration when a valid confirmation code passed; POST /api/auth/registration-confirmation', async () => {
    const mockEmailAdapter: jest.Mocked<typeof nodemailerAdapter> = createMockEmailAdapter();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();

    const registerUserResult: Result<{ createdUserId: string }> = await authService.registerUser(
      createUserData,
      mockEmailAdapter
    );

    const createdUserId: string = registerUserResult.data.createdUserId;
    const createdUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    const createdUserConfirmationCode: string = createdUserDB!.emailConfirmation.confirmationCode;

    await confirmUserByCode(app, createdUserConfirmationCode);

    const confirmedUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('✅ 003 should resend a confirmation mail when a valid email passed; POST /api/auth/registration-email-resending', async () => {
    const mockEmailAdapter: jest.Mocked<typeof nodemailerAdapter> = createMockEmailAdapter();
    const usersServiceCreateSpy = createUsersServiceCreateSpy();
    const usersServiceConfirmByCodeSpy = createUsersServiceConfirmByCodeSpy();
    const usersServiceUpdateEmailConfirmationByEmailSpy = createUsersServiceUpdateEmailConfirmationByEmailSpy();
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserEmail: string = createUserData.email;

    const registerUserResult: Result<{ createdUserId: string }> = await authService.registerUser(
      createUserData,
      mockEmailAdapter
    );

    const createdUserId: string = registerUserResult.data.createdUserId;
    const createdUserDBBeforeResending: UserDBType | null = await usersRepository.findById(createdUserId);

    const createdUserConfirmationCodeBeforeResending: string =
      createdUserDBBeforeResending!.emailConfirmation.confirmationCode;

    const createdUserExpirationDateBeforeResending: Date =
      createdUserDBBeforeResending!.emailConfirmation.expirationDate;

    const resendConfirmationEmailResult: Result<{} | null> = await authService.resendConfirmationEmail(
      createdUserEmail,
      mockEmailAdapter
    );

    const createdUserDBAfterResending: UserDBType | null = await usersRepository.findById(createdUserId);

    const createdUserConfirmationCodeAfterResending: string =
      createdUserDBAfterResending!.emailConfirmation.confirmationCode;

    const createdUserExpirationDateAfterResending: Date = createdUserDBAfterResending!.emailConfirmation.expirationDate;
    expect(createdUserDBBeforeResending!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserDBAfterResending!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserConfirmationCodeAfterResending).not.toBe(createdUserConfirmationCodeBeforeResending);
    expect(createdUserExpirationDateAfterResending).not.toBe(createdUserExpirationDateBeforeResending);
    expect(resendConfirmationEmailResult.status).toBe(ResultStatuses.NoContent);
    expect(resendConfirmationEmailResult.extensions).toBeInstanceOf(Array);
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(2);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).toHaveBeenCalledTimes(1);

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Complete Registration',
      expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      emailExamples.completeRegistrationEmail
    );

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Resending Complete Registration Mail',
      expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      emailExamples.completeRegistrationEmail
    );

    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });
});
