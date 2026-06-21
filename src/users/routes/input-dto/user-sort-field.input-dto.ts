/*Input DTO для разрешенных значений query-параметра "sortBy", используемого для сортировки пользователей при
пагинации.*/
export enum UserSortFieldInputDTO {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}
