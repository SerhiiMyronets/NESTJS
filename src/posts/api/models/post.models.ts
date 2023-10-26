import { IsMongoId, MaxLength, Validate } from 'class-validator';
import { BlogExistValidation } from '../../pipes/blogExistValidation';
import { OmitType } from '@nestjs/swagger';

export class ParamModel {
  @IsMongoId()
  id: string;
}

export class BlogIdParamModel {
  @Validate(BlogExistValidation)
  @IsMongoId()
  id: string;
}

export class PostDTOModel {
  @MaxLength(30)
  title: string;
  @MaxLength(100)
  shortDescription: string;
  @MaxLength(1000)
  content: string;
  @Validate(BlogExistValidation)
  @IsMongoId()
  blogId: string;
  @MaxLength(15)
  blogName: string;
}

export class PostInputModel extends OmitType(PostDTOModel, [
  'blogName',
] as const) {}

export class PostByBlogInputModel extends OmitType(PostInputModel, [
  'blogId',
] as const) {}

export type PostInputQueryModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: extendedLikesInfoViewModel;
};

export type extendedLikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: newestLikesViewModel[];
};
export type newestLikesViewModel = {
  addedAt: Date;
  userId: string;
  login: string;
};

export type PostViewModelPaginated = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
};

export enum sortDirectionList {
  'asc' = 1,
  'desc' = -1,
}
