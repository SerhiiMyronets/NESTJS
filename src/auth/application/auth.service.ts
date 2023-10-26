import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/application/user.service';
import {
  ConfirmationCodeModel,
  UserInputModel,
} from '../api/models/auth.models';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected mailService: MailService,
  ) {}

  async register(inputModel: UserInputModel): Promise<boolean> {
    inputModel.password = await bcrypt.hash(inputModel.password, 10);
    const newUser = await this.userService.createUser(inputModel);
    this.mailService.sendUserConfirmation(newUser);
    return true;
  }

  async confirmUser(inputModel: ConfirmationCodeModel) {
    await this.userService.confirmUser(inputModel.code);
  }
}
