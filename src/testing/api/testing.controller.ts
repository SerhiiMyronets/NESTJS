import { Controller, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../../posts/domain/post.schema';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../comments/domain/comment.schema';
import { Blog, BlogDocument } from '../../blogs/domain/blog.schema';
import { User, UserModelType } from '../../users/domain/user.schema';

@Controller()
export class TestingController {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}

  @Delete('/testing/all-data')
  async deleteAllData() {
    await this.PostModel.deleteMany();
    await this.CommentModel.deleteMany();
    await this.BlogModel.deleteMany();
    await this.UserModel.deleteMany();
  }
}
