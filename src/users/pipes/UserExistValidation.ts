import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../infrastructure/repository/user.repository';

@ValidatorConstraint({ name: 'BlogExist', async: true })
export class UserExistValidation implements ValidatorConstraintInterface {
  constructor(protected userRepository: UserRepository) {}

  async validate(loginOrEmail: string) {
    const user = await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
    return !user;
  }

  defaultMessage() {
    return `User with $property '$value' is already exist `;
  }
}
