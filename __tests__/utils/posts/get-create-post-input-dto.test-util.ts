import { CreatePostInputDTO } from '../../../src/posts/routes/input-dto/create-post.input-dto';

export const getCreatePostInputDTO = (blogId: string): CreatePostInputDTO => {
  return {
    title: 'title 01',
    shortDescription: 'shortDescription 01',
    content: 'content 01',
    blogId: blogId,
  };
};
