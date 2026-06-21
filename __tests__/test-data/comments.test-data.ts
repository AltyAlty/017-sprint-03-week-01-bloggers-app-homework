export const validCommentsPaginationSettings = {
  pageSize: 5,
  pageNumber: 1,
  sortDirection: 'asc',
  sortBy: 'content',
};

export const invalidCommentsPaginationSettings = {
  pageSize: 101,
  pageNumber: -1,
  sortDirection: 'cas',
  sortBy: 'description',
};

export const invalidCommentIds = {
  id_01: 'ABC',
  id_02: 2,
  id_03: null,
};

export const invalidCommentContents = {
  content_01: 'qwe123zxc',
  content_02: '',
  content_03: '   ',
  content_04: 'ABC',
  content_05: '1234567890',
  content_06: [],
  content_07: {},
  content_08: null,
  content_09: undefined,
  content_10: 1234567890,
};
