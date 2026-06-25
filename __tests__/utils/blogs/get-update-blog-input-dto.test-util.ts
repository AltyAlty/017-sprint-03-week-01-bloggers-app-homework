import { UpdateBlogByIdInputDTO } from '../../../src/blogs/routes/input-dto/update-blog-by-id.input-dto';

export const getUpdateBlogInputDTO = (): UpdateBlogByIdInputDTO => {
  return {
    name: 'upd name 01',
    description: 'upd description 01',
    websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
  };
};
