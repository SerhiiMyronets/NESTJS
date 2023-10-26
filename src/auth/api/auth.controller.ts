import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import {
  ConfirmationCodeModel,
  LoginInputModel,
  UserInputModel,
} from './models/auth.models';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('login')
  async login(@Body() inputModel: LoginInputModel) {
    return inputModel;
  }

  @Post('registration')
  @HttpCode(204)
  async registerNewUser(@Body() inputModel: UserInputModel) {
    await this.authService.register(inputModel);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmUser(@Body() inputModel: ConfirmationCodeModel) {
    await this.authService.confirmUser(inputModel);
  }
}
