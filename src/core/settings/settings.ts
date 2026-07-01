import { SortDirection } from '../types/pagination/sort-direction';

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL: process.env.MONGO_URL_LOCAL || '',

  BLOGS_PATH: '/api/blogs',
  GET_BLOG_LIST_PATH: '',
  CREATE_BLOG_PATH: '',
  GET_POST_LIST_BY_BLOG_ID_PATH: '/:blogId/posts',
  CREATE_POST_FOR_BLOG_PATH: '/:blogId/posts',
  GET_BLOG_BY_ID_PATH: '/:id',
  UPDATE_BLOG_BY_ID_PATH: '/:id',
  DELETE_BLOG_BY_ID_PATH: '/:id',

  POSTS_PATH: '/api/posts',
  GET_COMMENT_LIST_BY_POST_ID_PATH: '/:postId/comments',
  CREATE_COMMENT_FOR_POST_PATH: '/:postId/comments',
  GET_POST_LIST_PATH: '',
  CREATE_POST_PATH: '',
  GET_POST_BY_ID_PATH: '/:id',
  UPDATE_POST_BY_ID_PATH: '/:id',
  DELETE_POST_BY_ID_PATH: '/:id',

  COMMENTS_PATH: '/api/comments',
  UPDATE_COMMENT_BY_ID_PATH: '/:id',
  DELETE_COMMENT_BY_ID_PATH: '/:id',
  GET_COMMENT_BY_ID_PATH: '/:id',

  USERS_PATH: '/api/users',
  GET_USER_LIST_PATH: '',
  CREATE_USER_PATH: '',
  DELETE_USER_BY_ID_PATH: '/:id',

  AUTH_PATH: '/api/auth',
  AUTH_BY_LOGIN_OR_EMAIL_PATH: '/login',
  GET_AUTH_DATA_BY_TOKEN_PATH: '/me',
  REGISTER_USER_PATH: '/registration',
  CONFIRM_USER_BY_CODE_PATH: '/registration-confirmation',
  RESEND_CONFIRMATION_EMAIL_PATH: '/registration-email-resending',
  REFRESH_TOKEN_PATH: '/refresh-token',
  LOGOUT_PATH: '/logout',

  SECURITY_DEVICES_PATH: '/api/security/devices',
  GET_SECURITY_DEVICE_LIST_PATH: '',
  REVOKE_SESSIONS_EXCEPT_CURRENT_DEVICE_PATH: '',
  REVOKE_SESSION_BY_DEVICE_ID_PATH: '/:id',

  TESTING_PATH: '/api/testing',
  CLEAR_DB_PATH: '/all-data',

  DB_NAME: process.env.DB_NAME || '017-s-03-w-01-bloggers-app-hw',
  TEST_DB_NAME: process.env.DB_NAME || '017-s-03-w-01-bloggers-app-hw-test',

  BLOGS_COLLECTION_NAME: 'blogs',
  POSTS_COLLECTION_NAME: 'posts',
  COMMENTS_COLLECTION_NAME: 'comments',
  USERS_COLLECTION_NAME: 'users',
  SESSIONS_COLLECTION_NAME: 'sessions',
  SECURITY_DEVICES_COLLECTION_NAME: 'securityDevices',
  REQUEST_RATE_LIMIT_LOGS_COLLECTION_NAME: 'requestRateLimitLogs',

  DEFAULT_PAGINATION_PAGE_NUMBER: 1,
  DEFAULT_PAGINATION_PAGE_SIZE: 10,
  DEFAULT_PAGINATION_SORT_DIRECTION: SortDirection.Desc,
  DEFAULT_PAGINATION_SORT_BY: 'createdAt',

  BASIC_AUTH_ADMIN_USERNAME: process.env.BASIC_AUTH_ADMIN_USERNAME,
  BASIC_AUTH_ADMIN_PASSWORD: process.env.BASIC_AUTH_ADMIN_PASSWORD,

  AT_SECRET: process.env.AT_SECRET,
  AT_TIME: process.env.AT_TIME,
  RT_SECRET: process.env.RT_SECRET,
  RT_TIME: process.env.RT_TIME,
  RT_TIME_DATE_FNS: { seconds: Number(process.env.RT_TIME_DATE_FNS) },
  RT_TTL: Number(process.env.RT_TTL),

  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_APP_PASS: process.env.EMAIL_APP_PASS,
  DEFAULT_CODE_EXPIRATION_TIME: { minutes: Number(process.env.DEFAULT_CODE_EXPIRATION_TIME) },

  REQUEST_RATE_LIMIT: process.env.REQUEST_RATE_LIMIT,
  REQUEST_RATE_LIMIT_TIME_IN_SECONDS: process.env.REQUEST_RATE_LIMIT_TIME_IN_SECONDS,
  REQUEST_RATE_LIMIT_LOG_EXPIRATION_TIME_IN_SECONDS: process.env.REQUEST_RATE_LIMIT_LOG_EXPIRATION_TIME_IN_SECONDS,
};
