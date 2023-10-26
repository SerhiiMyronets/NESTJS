import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogQueryRepository } from '../../blogs/infrastructure/repository/blog.query.repository';

@ValidatorConstraint({ name: 'BlogExist', async: true })
export class BlogExistValidation implements ValidatorConstraintInterface {
  constructor(protected blogQueryRepository: BlogQueryRepository) {}

  async validate(blogId: string) {
    const blog = await this.blogQueryRepository.getBlog(blogId);
    return !!blog;
  }

  defaultMessage() {
    return 'Blog doesnt exist!';
  }
}
