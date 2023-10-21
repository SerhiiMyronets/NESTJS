import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { updateBlogInputModel } from '../api/models/blog.models';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop()
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: false })
  isMembership: boolean;

  updateBlog(updateDTO: updateBlogInputModel) {
    this.name = updateDTO.name;
    this.description = updateDTO.description;
    this.websiteUrl = updateDTO.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
};
