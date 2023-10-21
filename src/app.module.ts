import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blogs/api/blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.schema';
import { BlogRepository } from './blogs/infrastructure/repository/blog.repository';
import { BlogService } from './blogs/application/blog.service';
import { BlogQueryRepository } from './blogs/infrastructure/repository/blog.query.repository';
import { PostController } from './posts/api/post.controller';
import { PostService } from './posts/application/post.service';
import { PostQueryRepository } from './posts/infrastrusture/repository/post.query.repository';
import { PostRepository } from './posts/infrastrusture/repository/post.repository';
import { Post, PostSchema } from './posts/domain/post.schema';
import { Comment, CommentSchema } from './comments/domain/comment.schema';
import { CommentController } from './comments/api/comment.controller';
import { CommentService } from './comments/application/comment.service';
import { CommentQueryRepository } from './comments/infrastructure/repository/comment.query.repository';
import { CommentRepository } from './comments/infrastructure/repository/comment.repository';
import { UserController } from './users/api/user.controller';
import { UserService } from './users/application/user.service';
import { UserRepository } from './users/infrastructure/repository/user.repository';
import { UserQueryRepository } from './users/infrastructure/repository/user.query.repository';
import { User, UserSchema } from './users/domain/user.schema';
import { ConfigModule } from '@nestjs/config';

console.log(process.env.MONGOOSE_URI);
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGOOSE_URI!),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AppController,
    BlogController,
    PostController,
    CommentController,
    UserController,
  ],
  providers: [
    AppService,
    BlogService,
    BlogRepository,
    BlogQueryRepository,
    PostService,
    PostQueryRepository,
    PostRepository,
    CommentService,
    CommentQueryRepository,
    CommentRepository,
    UserService,
    UserRepository,
    UserQueryRepository,
  ],
})
export class AppModule {}
