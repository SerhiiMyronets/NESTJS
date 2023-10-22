import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../domain/comment.schema';
import {
  CommentInputQueryModel,
  CommentViewModel,
  CommentViewModelPaginated,
  sortDirectionList,
} from '../../api/models/comment.models';

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  async getComment(id: string) {
    return this.CommentModel.findById(id, {
      _id: 0,
      id: { $toString: '$_id' },
      content: 1,
      commentatorInfo: 1,
      createdAt: 1,
      likesInfo: 1,
    }).lean();
  }

  async getComments(
    query: CommentInputQueryModel,
    postId: string,
  ): Promise<CommentViewModelPaginated> {
    query = this._getQueryDefaults(query);
    const filter = { postId: postId };
    const totalCount = await this.CommentModel.countDocuments(filter);
    const foundedComments: CommentViewModel[] = await this.CommentModel.find(
      filter,
      {
        _id: 0,
        id: { $toString: '$_id' },
        content: 1,
        commentatorInfo: 1,
        createdAt: 1,
        likesInfo: 1,
      },
    )
      .sort({ [query.sortBy]: sortDirectionList[query.sortDirection], _id: -1 })
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      .lean();
    return this._getPaginated(
      foundedComments,
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

  _getQueryDefaults(query: CommentInputQueryModel) {
    if (!query.sortBy) query.sortBy = 'createdAt';
    if (!query.sortDirection) query.sortDirection = 'desc';
    query.pageNumber
      ? (query.pageNumber = +query.pageNumber)
      : (query.pageNumber = 1);
    query.pageSize ? (query.pageSize = +query.pageSize) : (query.pageSize = 10);
    return query;
  }
}
