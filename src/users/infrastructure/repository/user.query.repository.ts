import { Injectable } from '@nestjs/common';
import {
  sortDirectionList,
  UserInputQueryModel,
  UserViewModel,
  UserViewModelPaginated,
} from '../../api/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../domain/user.schema';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async getUsers(query: UserInputQueryModel): Promise<UserViewModelPaginated> {
    query = this._getQueryDefaults(query);
    let searchFilter = {};
    const searchArray: any = [];
    if (query.searchLoginTerm)
      searchArray.push({
        'accountData.login': new RegExp(query.searchLoginTerm, 'i'),
      });
    if (query.searchEmailTerm)
      searchArray.push({
        'accountData.email': new RegExp(query.searchEmailTerm, 'i'),
      });
    if (searchArray.length > 0) searchFilter = { $or: searchArray };
    const totalCount = await this.UserModel.countDocuments(searchFilter);
    const foundedUsers: UserViewModel[] = await this.UserModel.find(
      searchFilter,
      {
        _id: 0,
        id: { $toString: '$_id' },
        login: '$accountData.login',
        email: '$accountData.email',
        createdAt: '$accountData.createdAt',
      },
    )
      .sort({
        [`accountData.${query.sortBy}`]: sortDirectionList[query.sortDirection],
        _id: -1,
      })
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      .lean();
    return this._getPaginated(
      foundedUsers,
      +query.pageNumber,
      +query.pageSize,
      totalCount,
    );
  }

  async getUser(id: string): Promise<UserViewModel | null> {
    return this.UserModel.findById(id, {
      _id: 0,
      id: { $toString: '$_id' },
      login: '$accountData.login',
      email: '$accountData.email',
      createdAt: '$accountData.createdAt',
    }).lean();
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

  _getQueryDefaults(query: UserInputQueryModel) {
    if (!query.sortBy) query.sortBy = 'createdAt';
    if (!query.sortDirection) query.sortDirection = 'desc';
    query.pageNumber
      ? (query.pageNumber = +query.pageNumber)
      : (query.pageNumber = 1);
    query.pageSize ? (query.pageSize = +query.pageSize) : (query.pageSize = 10);
    return query;
  }
}
