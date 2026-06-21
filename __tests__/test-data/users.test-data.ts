export const validUsersPaginationSettings = {
  pageSize: 5,
  pageNumber: 1,
  searchLoginTerm: 'i',
  searchEmailTerm: 'abc',
  sortDirection: 'asc',
  sortBy: 'login',
};

export const invalidUsersPaginationSettings = {
  pageSize: 101,
  pageNumber: -1,
  sortDirection: 'cas',
  sortBy: 'name',
};

export const validUserData = {
  data_01: { login: 'John', email: 'moon@example.com' },
  data_02: { login: 'Abby', email: 'earth@example.com' },
  data_03: { login: 'Mike', email: 'pluto@example.com' },
  data_04: { login: 'Jim', email: 'mercury@example.abc' },
  data_05: { login: 'Kate', email: 'venus@example.com' },
  data_06: { login: 'Billy', email: 'satrun@example.abc' },
};

export const invalidUserLogins = {
  login_01: '',
  login_02: '   ',
  login_03: '0123456789111111',
  login_04: '!@#$%^&*()',
  login_05: 'ab',
  login_06: null,
};

export const invalidUserEmails = {
  email_01: '',
  email_02: '   ',
  email_03: 'user#example.com',
  email_04: 'fd2xny8xnf',
  email_05: null,
};

export const invalidUserLoginsOrEmails = {
  loginOrEmail_01: '',
  loginOrEmail_02: '   ',
  loginOrEmail_03: null,
};

export const invalidUserPasswords = {
  password_01: '',
  password_02: '   ',
  password_03: '12345',
  password_04: '012345678901234567890',
  password_05: '01234567890123456789000000',
  password_06: null,
};

export const invalidUserIds = {
  id_01: 'ABC',
  id_02: 2,
  id_03: null,
};
