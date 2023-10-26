import { IsEmail, IsUUID, Length, Validate } from 'class-validator';
import { UserExistValidation } from '../../../users/pipes/UserExistValidation';
import { ConfirmationCodeValidation } from '../../validationPipes/confirmation.code.validation';

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

export class ConfirmationCodeModel {
  @Validate(ConfirmationCodeValidation)
  @IsUUID()
  code: string;
}

export class LoginInputModel {
  loginOrEmail: string;
  password: string;
}
