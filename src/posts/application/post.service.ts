import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/post.schema';
import { PostRepository } from '../infrastrusture/repository/post.repository';
import { PostDTOModel } from '../api/models/post.models';

@Injectable()
export class PostService {
  constructor(
    protected postRepository: PostRepository,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
  ) {}

  async create(newPostDTO: PostDTOModel): Promise<string> {
    const newPost = new this.PostModel(newPostDTO);
    await this.postRepository.save(newPost);
    return newPost.id;
  }

  async update(id: string, inputModel: PostDTOModel): Promise<boolean> {
    const post = await this.postRepository.find(id);
    if (!post) return false;
    await post.updatePost(inputModel);
    await this.postRepository.save(post);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const post = await this.postRepository.find(id);
    if (!post) return false;
    await this.postRepository.delete(post);
    return true;
  }
}
