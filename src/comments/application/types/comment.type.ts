/*Тип для поля "commentatorInfo" в типе "CommentType".*/
export type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

/*Тип для комментария.*/
export type CommentType = {
  content: string;
  postId: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
};
