import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../domain/blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}
  async save(blog: BlogDocument) {
    await blog.save();
  }

  async delete(id: string) {
    await this.BlogModel.findByIdAndDelete(id);
  }
}
