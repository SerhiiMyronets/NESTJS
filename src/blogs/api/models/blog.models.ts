import { IsEmail, IsMongoId, Length } from 'class-validator';

export class ParamModel {
  @IsMongoId()
  id: string;
}

export class BlogInputModel {
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @Length(5, 100)
  @IsEmail()
  websiteUrl: string;
}

export type updateBlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogInputQueryModel = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogViewModelPaginated = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
};

export enum sortDirectionList {
  'asc' = 1,
  'desc' = -1,
}
