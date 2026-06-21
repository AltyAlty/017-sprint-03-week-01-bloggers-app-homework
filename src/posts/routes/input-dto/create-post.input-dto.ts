/*Input DTO для создания поста.*/
export type CreatePostInputDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
