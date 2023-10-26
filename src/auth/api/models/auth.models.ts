import { IsEmail, Length, Validate } from 'class-validator';
import { UserExistValidation } from '../../../users/pipes/UserExistValidation';

export class UserInputModel {
  @Validate(UserExistValidation)
  @Length(3, 10)
  login: string;
  @Length(8, 20)
  password: string;
  @Validate(UserExistValidation)
  @IsEmail()
  email: string;
}

export class LoginInputModel {
  loginOrEmail: string;
  password: string;
}
