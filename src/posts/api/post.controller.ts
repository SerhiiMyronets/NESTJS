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
  PostDTOModel,
  PostFullInputModel,
  PostByBlogInputModel,
  PostInputQueryModel,
  UpdatePostInputModel,
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
  async getPost(@Param('id') id: string) {
    const post = await this.postQueryRepository.getPost(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Get('posts')
  async getPosts(@Query() query: PostInputQueryModel) {
    return await this.postQueryRepository.getPosts(query);
  }

  @Get('blogs/:id/posts')
  async getPostsByBlog(
    @Param('id') id: string,
    @Query() query: PostInputQueryModel,
  ) {
    const blog = await this.blogQueryRepository.getBlog(id);
    if (!blog) throw new NotFoundException();
    return await this.postQueryRepository.getPosts(query, blog.id);
  }

  @Post('posts')
  async createPost(@Body() inputModel: PostFullInputModel) {
    const newPostDTO = await this._createPostDTO(inputModel);
    const postId = await this.postService.create(newPostDTO);
    return this.postQueryRepository.getPost(postId);
  }

  @Post('blogs/:id/posts')
  async createPostByBlog(
    @Param('id') id: string,
    @Body() inputBody: PostByBlogInputModel,
  ) {
    const fullInputModel = new PostFullInputModel(inputBody, id);
    const newPostDTO = await this._createPostDTO(fullInputModel);
    const postId = await this.postService.create(newPostDTO);
    return this.postQueryRepository.getPost(postId);
  }

  @Put('posts/:id')
  @HttpCode(204)
  async updatePost(
    @Param('id') id: string,
    @Body() inputModel: UpdatePostInputModel,
  ) {
    const newPostDTO = await this._createPostDTO(inputModel);
    const result = await this.postService.update(id, newPostDTO);
    if (!result) throw new NotFoundException();
  }

  @Delete('posts/:id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    const result = await this.postService.delete(id);
    if (!result) throw new NotFoundException();
  }
  async _createPostDTO(inputModel: PostFullInputModel): Promise<PostDTOModel> {
    const blog = await this.blogQueryRepository.getBlog(inputModel.blogId);
    if (!blog) throw new NotFoundException();
    return new PostDTOModel(inputModel, blog.name);
  }
}
