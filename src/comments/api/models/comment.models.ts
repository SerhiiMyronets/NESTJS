export type CommentInputModel = {
  content: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesInfo: LikesInfoViewModel;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type LikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

export type CommentViewModelPaginated = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModel[];
};

export type CommentInputQueryModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};

export enum sortDirectionList {
  'asc' = 1,
  'desc' = -1,
}
