import { CommentatorInfoType } from '../../application/types/comment.type';

/*Output DTO для комментария.*/
export type CommentOutputDTO = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
};
