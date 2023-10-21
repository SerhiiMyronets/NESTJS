import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UpdatePostInputModel } from '../api/models/post.models';

export type PostDocument = HydratedDocument<Post>;

@Schema({ _id: false, versionKey: false })
export class NewestLikes {
  @Prop()
  addedAt: Date;

  @Prop()
  userId: string;

  @Prop()
  login: string;
}

const NewestLikeSchema = SchemaFactory.createForClass<NewestLikes>(NewestLikes);

@Schema({ _id: false, versionKey: false })
export class ExtendedLikesInfo {
  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  dislikesCount: number;

  @Prop({ default: 'None' })
  myStatus: string;

  @Prop({ type: [NewestLikeSchema] })
  newestLikes: NewestLikes[];
}

const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass<ExtendedLikesInfo>(ExtendedLikesInfo);

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({
    type: ExtendedLikesInfoSchema,
    default: () => ({}),
  })
  extendedLikesInfo: ExtendedLikesInfo;

  updatePost(updateDTO: UpdatePostInputModel) {
    this.title = updateDTO.title;
    this.shortDescription = updateDTO.shortDescription;
    this.content = updateDTO.content;
    this.blogId = updateDTO.blogId;
    this.blogName = updateDTO.blogName;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods = {
  updatePost: Post.prototype.updatePost,
};
