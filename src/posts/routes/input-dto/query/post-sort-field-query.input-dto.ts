/*Input DTO для разрешенных значений query-параметра "sortBy", используемого для сортировки постов при пагинации.*/
export enum PostSortFieldQueryInputDTO {
  CreatedAt = 'createdAt',
  Title = 'title',
  ShortDescription = 'shortDescription',
  Content = 'content',
  BlogId = 'blogId',
  BlogName = 'blogName',
}
