import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ _id: false, versionKey: false })
export class LikesInfo {
  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  dislikesCount: number;

  @Prop({ default: 'None' })
  myStatus: string;
}
const LikesInfoSchema = SchemaFactory.createForClass<LikesInfo>(LikesInfo);

@Schema({ _id: false, versionKey: false })
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: number;
}
const CommentatorInfoSchema =
  SchemaFactory.createForClass<CommentatorInfo>(CommentatorInfo);

@Schema()
export class Comment {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({
    type: CommentatorInfoSchema,
    default: () => ({}),
  })
  commentatorInfo: CommentatorInfo;

  @Prop({
    type: LikesInfoSchema,
    default: () => ({}),
  })
  extendedLikesInfo: LikesInfo;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
