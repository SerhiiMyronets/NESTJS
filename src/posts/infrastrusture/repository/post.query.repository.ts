import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../domain/post.schema';
import {
  PostInputQueryModel,
  PostViewModel,
  PostViewModelPaginated,
  sortDirectionList,
} from '../../api/models/post.models';

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}
  async getPost(id: string): Promise<PostViewModel | null> {
    return this.PostModel.findById(id, {
      _id: 0,
      id: { $toString: '$_id' },
      title: 1,
      shortDescription: 1,
      content: 1,
      blogId: 1,
      blogName: 1,
      createdAt: 1,
      'extendedLikesInfo.likesCount': 1,
      'extendedLikesInfo.dislikesCount': 1,
      'extendedLikesInfo.myStatus': 1,
      'extendedLikesInfo.newestLikes': 1,
    }).lean();
  }

  async getPosts(
    query: PostInputQueryModel,
    blogId?: string,
  ): Promise<PostViewModelPaginated> {
    query = this._getQueryDefaults(query);
    const filter = blogId ? { blogId: blogId } : { undefined };
    const totalCount = await this.PostModel.countDocuments(filter);
    const foundedBlogs: PostViewModel[] = await this.PostModel.find(filter, {
      _id: 0,
      id: { $toString: '$_id' },
      title: 1,
      shortDescription: 1,
      content: 1,
      blogId: 1,
      blogName: 1,
      createdAt: 1,
      extendedLikesInfo: 1,
    })
      .sort({
        [query.sortBy]: sortDirectionList[query.sortDirection],
        _id: sortDirectionList[query.sortDirection],
      })
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      .lean();
    return this._getPaginated(
      foundedBlogs,
      query.pageNumber,
      query.pageSize,
      totalCount,
    );
  }
  _getPaginated<Type>(
    items: Array<Type>,
    page: number,
    pageSize: number,
    totalCount: number,
  ) {
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
      totalCount,
      items,
    };
  }
  _getQueryDefaults(query: PostInputQueryModel) {
    if (!query.sortBy) query.sortBy = 'createdAt';
    if (!query.sortDirection) query.sortDirection = 'desc';
    query.pageNumber
      ? (query.pageNumber = +query.pageNumber)
      : (query.pageNumber = 1);
    query.pageSize ? (query.pageSize = +query.pageSize) : (query.pageSize = 10);
    return query;
  }
}
