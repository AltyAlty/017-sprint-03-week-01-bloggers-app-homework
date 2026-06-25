/*Input DTO для изменения поста по ID.*/
export type UpdatePostByIdInputDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
