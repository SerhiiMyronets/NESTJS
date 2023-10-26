import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { PostQueryRepository } from '../../posts/infrastrusture/repository/post.query.repository';
import { CommentService } from '../application/comment.service';
import { CommentQueryRepository } from '../infrastructure/repository/comment.query.repository';
import { CommentInputQueryModel, ParamModel } from './models/comment.models';

@Controller()
export class CommentController {
  constructor(
    protected commentsService: CommentService,
    protected commentsQueryRepository: CommentQueryRepository,
    protected postQueryRepository: PostQueryRepository,
  ) {}

  @Get('/comments/:id')
  async getComment(@Param() params: ParamModel) {
    const comment = await this.commentsQueryRepository.getComment(params.id);
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @Get('posts/:id/comments')
  async getCommentsByPost(
    @Param() params: ParamModel,
    @Query() query: CommentInputQueryModel,
  ) {
    const post = await this.postQueryRepository.getPost(params.id);
    if (!post) throw new NotFoundException();
    return await this.commentsQueryRepository.getComments(query, post.id);
  }
}
