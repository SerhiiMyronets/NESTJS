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
  BlogInputModel,
  BlogInputQueryModel,
  ParamModel,
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
  async getBlog(@Param() params: ParamModel) {
    const blog = await this.blogQueryRepository.getBlog(params.id);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @Post('blogs')
  async createBlog(@Body() inputModel: BlogInputModel) {
    const blogId = await this.blogService.create(inputModel);
    return this.blogQueryRepository.getBlog(blogId);
  }

  @Put('blogs/:id')
  @HttpCode(204)
  async updateBlog(
    @Param() params: ParamModel,
    @Body() inputModel: updateBlogInputModel,
  ) {
    const result = await this.blogService.update(params.id, inputModel);
    if (!result) throw new NotFoundException();
  }

  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlog(@Param() params: ParamModel) {
    const result = await this.blogService.delete(params.id);
    if (!result) throw new NotFoundException();
  }
}
