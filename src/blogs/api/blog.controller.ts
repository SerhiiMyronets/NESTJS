import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogQueryRepository } from '../infrastructure/repository/blog.query.repository';
import {
  BlogInputQueryModel,
  newBlogInputModel,
  updateBlogInputModel,
} from './models/blog.models';

@Controller()
export class BlogController {
  constructor(
    protected blogService: BlogService,
    protected blogQueryRepository: BlogQueryRepository,
  ) {}
  @Get('blogs')
  async getBlogs(@Query() query: BlogInputQueryModel) {
    return await this.blogQueryRepository.getBlogs(query);
  }

  @Get('blogs/:id')
  async getBlog(@Param('id') id: string) {
    const blog = await this.blogQueryRepository.getBlog(id);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @Post('blogs')
  async createBlog(@Body() inputModel: newBlogInputModel) {
    const blogId = await this.blogService.create(inputModel);
    return this.blogQueryRepository.getBlog(blogId);
  }

  @Put('blogs/:id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() inputModel: updateBlogInputModel,
  ) {
    const result = await this.blogService.update(id, inputModel);
    if (!result) throw new NotFoundException();
  }

  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    const result = await this.blogService.delete(id);
    if (!result) throw new NotFoundException();
  }
}

// export class Model {
//   @IsString()
//   name: string;
//
//   @IsEmail()
//   email: string;
// }
//
// export class ModelWithId extends Model {
//   @IsUUID()
//   id: string;
//
//   constructor(id: string, mod: Model) {
//     super();
//     this.id = id;
//
//     for (const [key, value] of Object.entries(mod)) {
//       this[key] = value;
//     }
//   }
// }
