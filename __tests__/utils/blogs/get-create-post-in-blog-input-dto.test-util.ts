import { CreatePostForBlogByBlogIdInputDTO } from '../../../src/posts/routes/input-dto/create-post-for-blog-by-blog-id.input-dto';

export const getCreatePostInBlogInputDTO = (): CreatePostForBlogByBlogIdInputDTO => {
  return {
    title: 'title 01',
    shortDescription: 'shortDescription 01',
    content: 'content 01',
  };
};
