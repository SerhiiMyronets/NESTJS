export class UserInputModel {
  login: string;
  password: string;
  email: string;
}

export class UserInputQueryModel {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
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
