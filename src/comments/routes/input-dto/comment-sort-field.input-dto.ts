/*Input DTO для разрешенных значений query-параметра "sortBy", используемого для сортировки комментариев при
пагинации.*/
export enum CommentSortFieldInputDTO {
  CreatedAt = 'createdAt',
  PostId = 'postId',
  Content = 'content',
  CommentatorInfo = 'commentatorInfo',
}
