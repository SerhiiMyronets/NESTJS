import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { randomUUID } from 'crypto';
//import add from 'date-fns/add';
import { UserInputModel } from '../api/models/user.model';

export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument> & UserModelStaticType;

@Schema({ _id: false, versionKey: false })
export class AccountData {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

const AccountDataSchema =
  SchemaFactory.createForClass<AccountData>(AccountData);

@Schema({ _id: false, versionKey: false })
export class EmailConfirmation {
  @Prop({ default: randomUUID() })
  confirmationCode: string;

  @Prop({
    default: new Date(),
  })
  expirationDate: Date;

  @Prop({ default: false })
  isConfirmed: boolean;
}

const EmailConfirmationSchema =
  SchemaFactory.createForClass<EmailConfirmation>(EmailConfirmation);

@Schema()
export class User {
  @Prop({ type: AccountDataSchema, default: () => ({}) })
  accountData: AccountData;

  @Prop({
    type: EmailConfirmationSchema,
    default: () => ({}),
  })
  emailConfirmation: EmailConfirmation;

  confirmUser() {
    this.emailConfirmation.isConfirmed = true;
  }

  static createConfirmedUser(
    inputModel: UserInputModel,
    UserModel: UserModelType,
  ): UserDocument {
    const user = new UserModel({ accountData: inputModel });
    user.emailConfirmation.isConfirmed = true;
    return user;
  }

  static registerUser(
    inputModel: UserInputModel,
    UserModel: UserModelType,
  ): UserDocument {
    return new UserModel({ accountData: inputModel });
  }
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  confirmUser: User.prototype.confirmUser,
};

UserSchema.statics = {
  createConfirmedUser: User.createConfirmedUser,
  registerUser: User.registerUser,
} as UserModelStaticType;

export type UserModelStaticType = {
  createConfirmedUser: (
    inputModel: UserInputModel,
    UserModel: UserModelType,
  ) => UserDocument;
  registerUser: (
    inputModel: UserInputModel,
    UserModel: UserModelType,
  ) => UserDocument;
};
