export const validBlogsPaginationSettings = {
  pageSize: 5,
  pageNumber: 1,
  searchNameTerm: 'blog',
  sortDirection: 'asc',
  sortBy: 'name',
};

export const invalidBlogsPaginationSettings = {
  pageSize: 101,
  pageNumber: -1,
  sortDirection: 'cas',
  sortBy: 'shortDescription',
};

export const invalidBlogIds = {
  id_01: 'ABC',
  id_02: 2,
  id_03: null,
  id_04: '   ',
};

export const validBlogNames = {
  name_01: 'blog name 01',
  name_02: 'blog name 02',
  name_03: 'blog name 03',
  name_04: 'blog name 04',
  name_05: 'blog name 05',
  name_06: 'blog name 06',
};

export const invalidBlogNames = {
  name_01: '',
  name_02: '   ',
  name_03: '0123456789111111',
  name_04: null,
};

export const invalidBlogDescriptions = {
  description_01: '',
  description_02: '   ',
  description_03: null,
};

export const invalidBlogWebsiteUrls = {
  websiteUrl_01: '',
  websiteUrl_02: '   ',
  websiteUrl_03: 'www.websiteurl01.com/blog-01',
  websiteUrl_04: null,
};
