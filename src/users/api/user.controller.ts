import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserQueryRepository } from '../infrastructure/repository/user.query.repository';
import { UserInputModel, UserInputQueryModel } from './models/user.model';

@Controller()
export class UserController {
  constructor(
    protected userService: UserService,
    protected userQueryRepository: UserQueryRepository,
  ) {}
  @Get('users')
  async getUsers(@Query() query: UserInputQueryModel) {
    return await this.userQueryRepository.getUsers(query);
  }

  @Post('users')
  async createUser(@Body() inputModel: UserInputModel) {
    const userId = await this.userService.createConfirmedUserUser(inputModel);
    return this.userQueryRepository.getUser(userId);
  }
  @Delete('users/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    if (!result) throw new NotFoundException();
  }
}
