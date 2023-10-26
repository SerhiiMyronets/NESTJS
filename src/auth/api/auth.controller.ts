import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginInputModel, UserInputModel } from './models/auth.models';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('login')
  async login(@Body() inputModel: LoginInputModel) {
    return inputModel;
  }

  @Post('registration')
  async registerNewUser(@Body() inputModel: UserInputModel) {
    await this.authService.register(inputModel);
  }
}
