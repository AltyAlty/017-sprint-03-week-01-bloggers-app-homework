/*Input DTO для разрешенных значений query-параметра "sortBy", используемого для сортировки блогов при пагинации.*/
export enum BlogSortFieldQueryInputDTO {
  CreatedAt = 'createdAt',
  Name = 'name',
  Description = 'description',
  WebsiteUrl = 'websiteUrl',
}
