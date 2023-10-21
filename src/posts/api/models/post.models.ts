export class PostByBlogInputModel {
  title: string;
  shortDescription: string;
  content: string;
}

export class PostFullInputModel extends PostByBlogInputModel {
  blogId: string;

  constructor(mod: PostByBlogInputModel, blogId: string) {
    super();
    this.blogId = blogId;

    for (const [key, value] of Object.entries(mod)) {
      this[key] = value;
    }
  }
}

export class PostDTOModel extends PostFullInputModel {
  blogName: string;
  constructor(mod: PostFullInputModel, blogName: string) {
    super(mod, mod.blogId);
    this.blogName = blogName;

    for (const [key, value] of Object.entries(mod)) {
      this[key] = value;
    }
  }
}

export class UpdatePostInputModel {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}

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
