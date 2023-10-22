import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../domain/blog.schema';
import { Model, Types } from 'mongoose';
import {
  BlogInputQueryModel,
  BlogViewModel,
  BlogViewModelPaginated,
  sortDirectionList,
} from '../../api/models/blog.models';

@Injectable()
export class BlogQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}
  async getBlog(id: string): Promise<BlogViewModel | null> {
    return this.BlogModel.findById(new Types.ObjectId(id), {
      _id: 0,
      id: { $toString: '$_id' },
      name: 1,
      description: 1,
      websiteUrl: 1,
      createdAt: 1,
      isMembership: 1,
    }).lean();
  }
  async getBlogs(query: BlogInputQueryModel): Promise<BlogViewModelPaginated> {
    query = this.getQueryDefaults(query);
    const term = new RegExp(query.searchNameTerm, 'i');
    const totalCount = await this.BlogModel.countDocuments({ name: term });
    const foundedBlogs: BlogViewModel[] = await this.BlogModel.find(
      { name: term },
      {
        _id: 0,
        id: { $toString: '$_id' },
        name: 1,
        description: 1,
        websiteUrl: 1,
        createdAt: 1,
        isMembership: 1,
      },
    )
      .sort({ [query.sortBy]: sortDirectionList[query.sortDirection], _id: -1 })
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      .lean();
    return this.getPaginated(
      foundedBlogs,
      query.pageNumber,
      query.pageSize,
      totalCount,
    );
  }
  getPaginated<Type>(
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
  getQueryDefaults(query: BlogInputQueryModel) {
    if (!query.searchNameTerm) query.searchNameTerm = '';
    if (!query.sortBy) query.sortBy = 'createdAt';
    if (!query.sortDirection) query.sortDirection = 'desc';
    query.pageNumber
      ? (query.pageNumber = +query.pageNumber)
      : (query.pageNumber = 1);
    query.pageSize ? (query.pageSize = +query.pageSize) : (query.pageSize = 10);
    return query;
  }
}
