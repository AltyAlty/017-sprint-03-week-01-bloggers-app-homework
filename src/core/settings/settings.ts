import { SortDirection } from '../types/pagination/sort-direction';

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL: process.env.MONGO_URL || '',

  BLOGS_PATH: '/api/blogs',
  GET_BLOGS_LIST_PATH: '',
  CREATE_BLOG_PATH: '',
  GET_POSTS_LIST_BY_BLOG_ID_PATH: '/:blogId/posts',
  CREATE_POST_IN_BLOG_PATH: '/:blogId/posts',
  GET_BLOG_BY_ID_PATH: '/:id',
  UPDATE_BLOG_BY_ID_PATH: '/:id',
  DELETE_BLOG_BY_ID_PATH: '/:id',

  POSTS_PATH: '/api/posts',
  GET_COMMENTS_LIST_BY_POST_ID_PATH: '/:postId/comments',
  CREATE_COMMENT_IN_POST_PATH: '/:postId/comments',
  GET_POSTS_LIST_PATH: '',
  CREATE_POST_PATH: '',
  GET_POST_BY_ID_PATH: '/:id',
  UPDATE_POST_BY_ID_PATH: '/:id',
  DELETE_POST_BY_ID_PATH: '/:id',

  COMMENTS_PATH: '/api/comments',
  UPDATE_COMMENT_BY_ID_PATH: '/:id',
  DELETE_COMMENT_BY_ID_PATH: '/:id',
  GET_COMMENT_BY_ID_PATH: '/:id',

  USERS_PATH: '/api/users',
  GET_USERS_LIST_PATH: '',
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

  TESTING_PATH: '/api/testing',
  CLEAR_DB_PATH: '/all-data',

  DB_NAME: process.env.DB_NAME || '017-s-03-w-01-bloggers-app-hw',
  TEST_DB_NAME: process.env.DB_NAME || '017-s-03-w-01-bloggers-app-hw-test',

  BLOGS_COLLECTION_NAME: 'blogs',
  POSTS_COLLECTION_NAME: 'posts',
  COMMENTS_COLLECTION_NAME: 'comments',
  USERS_COLLECTION_NAME: 'users',
  REFRESH_TOKENS_COLLECTION_NAME: 'refresh_tokens',

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
};
