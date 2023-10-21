import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../domain/post.schema';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}
  async save(post: PostDocument) {
    await post.save();
  }

  async delete(post: PostDocument) {
    await post.deleteOne();
  }

  async find(id: string) {
    return this.PostModel.findById(id);
  }
}
