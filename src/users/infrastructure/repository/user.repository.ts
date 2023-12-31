import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../domain/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async save(user: UserDocument) {
    await user.save();
  }

  async delete(user: UserDocument) {
    await user.deleteOne();
  }

  async find(id: string): Promise<UserDocument | null> {
    return this.UserModel.findById(id);
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      $or: [
        { 'accountData.login': loginOrEmail },
        { 'accountData.email': loginOrEmail },
      ],
    });
  }

  async getUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }
}
