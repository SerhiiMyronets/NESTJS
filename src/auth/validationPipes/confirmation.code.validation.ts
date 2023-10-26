import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../../users/application/user.service';

@ValidatorConstraint({ name: 'BlogExist', async: true })
export class ConfirmationCodeValidation
  implements ValidatorConstraintInterface
{
  constructor(protected userService: UserService) {}

  async validate(code: string) {
    const user = await this.userService.getUserByConfirmationCode(code);
    if (!user) return false;
    return await this.userService.canBeConfirmed(user);
  }

  defaultMessage() {
    return 'User cant be confirmed!';
  }
}
