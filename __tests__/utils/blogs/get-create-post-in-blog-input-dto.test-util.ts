import { CreatePostInBlogInputDTO } from '../../../src/posts/routes/input-dto/create-post-in-blog.input-dto';

export const getCreatePostInBlogInputDTO = (): CreatePostInBlogInputDTO => {
  return {
    title: 'title 01',
    shortDescription: 'shortDescription 01',
    content: 'content 01',
  };
};
