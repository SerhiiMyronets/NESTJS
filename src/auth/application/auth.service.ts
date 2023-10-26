import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../users/infrastructure/repository/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../users/domain/user.schema';
import { UserService } from '../../users/application/user.service';
import { UserInputModel } from '../api/models/auth.models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected userRepository: UserRepository,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}

  async register(inputModel: UserInputModel): Promise<boolean> {
    inputModel.password = await bcrypt.hash(inputModel.password, 10);
    const newUser = this.UserModel.registerUser(inputModel, this.UserModel);
    await newUser.save();
    console.log(newUser);
    return true;
  }
}
