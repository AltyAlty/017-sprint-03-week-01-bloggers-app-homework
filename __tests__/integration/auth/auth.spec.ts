import 'dotenv/config';
import { getCreateUserInputDTO } from '../../utils/users/input-dto-utils/get-create-user-input-dto.test-util';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests.test-util';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { nodemailerAdapter } from '../../../src/auth/adapters/nodemailer.adapter';
import { authService } from '../../../src/auth/application/auth.service';
import { ResultStatuses } from '../../../src/core/types/result/result-statuses';
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
import { validUserAgents, validUUIDRegExp } from '../../test-data/auth.test-data';

describe('Auth', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should register a user when a valid body passed; 003. POST /api/auth/registration', async () => {
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
    expect(typeof createdUserId).toBe('string');
    expect(createdUserDB?.login).toEqual(createUserData.login);
    expect(createdUserDB?.email).toEqual(createUserData.email);
    expect(createdUserDB?.emailConfirmation.isConfirmed).toBeFalsy();
    expect(registerUserResult.status).toBe(ResultStatuses.Created);
    expect(registerUserResult.extensions).toBeInstanceOf(Array);
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Complete Registration',
      expect.stringMatching(validUUIDRegExp),
      emailExamples.completeRegistrationEmail
    );

    /*Приводим шпионов в изначальное состояния для использования их в других тестах.*/
    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('✅ 002 should confirm user registration when a correct confirmation code passed; 004. POST /api/auth/registration-confirmation', async () => {
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

    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserConfirmationCode);

    const confirmedUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    expect(createdUserDB?.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB?.emailConfirmation.isConfirmed).toBeTruthy();
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(1);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('✅ 003 should resend a confirmation mail when a correct email passed; 005. POST /api/auth/registration-email-resending', async () => {
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

    const resendConfirmationEmailResult: Result<{} | null> = await authService.resendConfirmationEmail(
      createdUserEmail,
      mockEmailAdapter
    );

    const createdUserDBAfterResending: UserDBType | null = await usersRepository.findById(createdUserId);

    expect(createdUserDBBeforeResending?.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserDBAfterResending?.emailConfirmation.isConfirmed).toBeFalsy();

    expect(createdUserDBBeforeResending?.emailConfirmation.confirmationCode).not.toBe(
      createdUserDBAfterResending?.emailConfirmation.confirmationCode
    );

    expect(createdUserDBBeforeResending?.emailConfirmation.expirationDate).not.toBe(
      createdUserDBAfterResending?.emailConfirmation.expirationDate
    );

    expect(resendConfirmationEmailResult.status).toBe(ResultStatuses.NoContent);
    expect(resendConfirmationEmailResult.extensions).toBeInstanceOf(Array);
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(2);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).not.toHaveBeenCalled();
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).toHaveBeenCalledTimes(1);

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Complete Registration',
      expect.stringMatching(validUUIDRegExp),
      emailExamples.completeRegistrationEmail
    );

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Resending Complete Registration Mail',
      expect.stringMatching(validUUIDRegExp),
      emailExamples.completeRegistrationEmail
    );

    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('✅ 004 should confirm user registration after resending a confirmation email when a correct confirmation code passed; 004. POST /api/auth/registration-confirmation', async () => {
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
    await authService.resendConfirmationEmail(createdUserEmail, mockEmailAdapter);
    const createdUserDBAfterResending: UserDBType | null = await usersRepository.findById(createdUserId);

    const createdUserDBConfirmationCodeAfterResending: string | undefined =
      createdUserDBAfterResending?.emailConfirmation.confirmationCode;

    await confirmUserByCode(app, validUserAgents.userAgent_01, createdUserDBConfirmationCodeAfterResending);

    const confirmedUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    expect(createdUserDBBeforeResending?.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserDBAfterResending?.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB?.emailConfirmation.isConfirmed).toBeTruthy();
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(2);
    expect(usersServiceCreateSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceConfirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(usersServiceUpdateEmailConfirmationByEmailSpy).toHaveBeenCalledTimes(1);

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Complete Registration',
      expect.stringMatching(validUUIDRegExp),
      emailExamples.completeRegistrationEmail
    );

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Resending Complete Registration Mail',
      expect.stringMatching(validUUIDRegExp),
      emailExamples.completeRegistrationEmail
    );

    usersServiceCreateSpy.mockRestore();
    usersServiceConfirmByCodeSpy.mockRestore();
    usersServiceUpdateEmailConfirmationByEmailSpy.mockRestore();
  });
});
