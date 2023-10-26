import { BlogRepository } from '../infrastructure/repository/blog.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.schema';
import { Model } from 'mongoose';
import {
  BlogInputModel,
  updateBlogInputModel,
} from '../api/models/blog.models';

@Injectable()
export class BlogService {
  constructor(
    protected blogRepository: BlogRepository,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
  ) {}

  async create(createCatDto: BlogInputModel): Promise<string> {
    const newBlog = new this.BlogModel(createCatDto);
    await this.blogRepository.save(newBlog);
    return newBlog.id;
  }

  async update(id: string, inputModel: updateBlogInputModel): Promise<boolean> {
    const blog = await this.BlogModel.findById(id);
    if (!blog) return false;
    await blog.updateBlog(inputModel);
    await this.blogRepository.save(blog);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const blog = await this.BlogModel.findById(id);
    if (!blog) return false;
    await this.blogRepository.delete(id);
    return true;
  }
}
