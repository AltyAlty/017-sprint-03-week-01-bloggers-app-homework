import { UpdatePostInputDTO } from '../../../src/posts/routes/input-dto/update-post.input-dto';

export const getUpdatePostInputDTO = (blogId: string): UpdatePostInputDTO => {
  return {
    title: 'upd title 01',
    shortDescription: 'upd shortDescription 01',
    content: 'upd content 01',
    blogId: blogId,
  };
};
