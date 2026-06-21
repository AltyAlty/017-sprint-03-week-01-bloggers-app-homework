import { UpdateBlogInputDTO } from '../../../src/blogs/routes/input-dto/update-blog.input-dto';

export const getUpdateBlogInputDTO = (): UpdateBlogInputDTO => {
  return {
    name: 'upd name 01',
    description: 'upd description 01',
    websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
  };
};
