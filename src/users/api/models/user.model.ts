import { IsEmail, IsMongoId, Length, Validate } from 'class-validator';
import { UserExistValidation } from '../../pipes/UserExistValidation';

export class ParamModel {
  @IsMongoId()
  id: string;
}

export class UserInputModel {
  @Validate(UserExistValidation)
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  password: string;
  @Validate(UserExistValidation)
  @IsEmail()
  email: string;
}

export class UserInputQueryModel {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  pageNumber: number = 1;
  pageSize: number = 10;
}

export class UserViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
}

export class UserViewModelPaginated {
  pagesCount: number;
  pageSize: number;
  page: number;
  totalCount: number;
  items: UserViewModel[];
}

export enum sortDirectionList {
  'asc' = 1,
  'desc' = -1,
}
