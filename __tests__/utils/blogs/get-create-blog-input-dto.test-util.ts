import { CreateBlogInputDTO } from '../../../src/blogs/routes/input-dto/create-blog.input-dto';

export const getCreateBlogInputDTO = (): CreateBlogInputDTO => {
  return {
    name: 'name 01',
    description: 'description 01',
    websiteUrl: 'https://www.websiteurl01.com/blog-01',
  };
};
