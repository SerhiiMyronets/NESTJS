import { Injectable } from '@nestjs/common';
import { UserInputModel } from '../api/models/user.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from '../infrastructure/repository/user.repository';
import { User, UserModelType } from '../domain/user.schema';

@Injectable()
export class UserService {
  constructor(
    protected userRepository: UserRepository,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}

  async createConfirmedUser(inputModel: UserInputModel) {
    inputModel.password = await bcrypt.hash(inputModel.password, 10);
    const user = this.UserModel.createConfirmedUser(inputModel, this.UserModel);
    await this.userRepository.save(user);
    return user.id;
  }
  async deleteUser(id: string) {
    const user = await this.userRepository.find(id);
    if (!user) return false;
    await this.userRepository.delete(user);
    return true;
  }
}
