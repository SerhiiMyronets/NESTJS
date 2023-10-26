import { Injectable } from '@nestjs/common';
import { UserInputModel } from '../api/models/user.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from '../infrastructure/repository/user.repository';
import { User, UserDocument, UserModelType } from '../domain/user.schema';

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
  async createUser(inputModel: UserInputModel) {
    inputModel.password = await bcrypt.hash(inputModel.password, 10);
    const user = this.UserModel.registerUser(inputModel, this.UserModel);
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.find(id);
    if (!user) return false;
    await this.userRepository.delete(user);
    return true;
  }

  async getUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    return await this.userRepository.getUserByConfirmationCode(code);
  }

  async confirmUser(code: string) {
    const user = await this.userRepository.getUserByConfirmationCode(code);
    user!.confirmUser();
    await this.userRepository.save(user!);
  }

  async canBeConfirmed(user: UserDocument): Promise<boolean> {
    return !(
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.expirationDate < new Date()
    );
  }
}
