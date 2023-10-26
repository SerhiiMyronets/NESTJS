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
import { PostService } from '../application/post.service';
import { PostQueryRepository } from '../infrastrusture/repository/post.query.repository';
import {
  BlogIdParamModel,
  ParamModel,
  PostByBlogInputModel,
  PostDTOModel,
  PostInputModel,
  PostInputQueryModel,
} from './models/post.models';
import { BlogQueryRepository } from '../../blogs/infrastructure/repository/blog.query.repository';

@Controller()
export class PostController {
  constructor(
    protected postService: PostService,
    protected postQueryRepository: PostQueryRepository,
    protected blogQueryRepository: BlogQueryRepository,
  ) {}

  @Get('/posts/:id')
  async getPost(@Param() params: ParamModel) {
    const post = await this.postQueryRepository.getPost(params.id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Get('posts')
  async getPosts(@Query() query: PostInputQueryModel) {
    return await this.postQueryRepository.getPosts(query);
  }

  @Get('blogs/:id/posts')
  async getPostsByBlog(
    @Param() params: ParamModel,
    @Query() query: PostInputQueryModel,
  ) {
    const blog = await this.blogQueryRepository.getBlog(params.id);
    if (!blog) throw new NotFoundException();
    return await this.postQueryRepository.getPosts(query, blog.id);
  }

  @Post('posts')
  async createPost(@Body() inputModel: PostInputModel) {
    const newPostDTO = await this._createPostDTO(inputModel);
    const postId = await this.postService.create(newPostDTO);
    return this.postQueryRepository.getPost(postId);
  }

  @Post('blogs/:id/posts')
  async createPostByBlog(
    @Param() params: BlogIdParamModel,
    @Body() inputBody: PostByBlogInputModel,
  ) {
    const fullInputModel = { ...inputBody, blogId: params.id };
    const newPostDTO = await this._createPostDTO(fullInputModel);

    const postId = await this.postService.create(newPostDTO);
    return this.postQueryRepository.getPost(postId);
  }

  @Put('posts/:id')
  @HttpCode(204)
  async updatePost(
    @Param() params: ParamModel,
    @Body() inputModel: PostDTOModel,
  ) {
    const newPostDTO = await this._createPostDTO(inputModel);
    const result = await this.postService.update(params.id, newPostDTO);
    if (!result) throw new NotFoundException();
  }

  @Delete('posts/:id')
  @HttpCode(204)
  async deletePost(@Param() params: ParamModel) {
    const result = await this.postService.delete(params.id);
    if (!result) throw new NotFoundException();
  }
  async _createPostDTO(inputModel: PostInputModel): Promise<PostDTOModel> {
    const blog = await this.blogQueryRepository.getBlog(inputModel.blogId);
    return { ...inputModel, blogName: blog!.name };
  }
}
