/*Output DTO для метаданных о пагинации.*/
export type PaginationMetaDataOutputDTO = {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
};
