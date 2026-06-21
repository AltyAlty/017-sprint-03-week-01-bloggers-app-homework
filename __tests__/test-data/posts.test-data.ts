export const validPostsPaginationSettings = {
  pageSize: 5,
  pageNumber: 1,
  sortDirection: 'asc',
  sortBy: 'title',
};

export const invalidPostsPaginationSettings = {
  pageSize: 101,
  pageNumber: -1,
  sortDirection: 'cas',
  sortBy: 'description',
};

export const invalidPostIds = {
  id_01: 'ABC',
  id_02: 2,
  id_03: null,
  id_04: '   ',
};

export const invalidPostTitles = {
  title_01: '',
  title_02: '   ',
  title_03: '0123456789012345678901234567890',
  title_04: '012345678901234567890123456789000000',
  title_05: null,
};

export const invalidPostShortDescriptions = {
  shortDescription_01: '',
  shortDescription_02: '   ',
  shortDescription_03: null,
};

export const invalidPostContents = {
  content_01: '',
  content_02: '   ',
  content_03: null,
};
