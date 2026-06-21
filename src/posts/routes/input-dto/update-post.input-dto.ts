/*Input DTO для изменения поста.*/
export type UpdatePostInputDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
