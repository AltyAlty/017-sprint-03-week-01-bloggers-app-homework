/*Input DTO для создания поста в блоге.*/
export type CreatePostForBlogByBlogIdInputDTO = {
  title: string;
  shortDescription: string;
  content: string;
};
