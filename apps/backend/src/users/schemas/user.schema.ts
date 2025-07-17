import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  githubId: number;

  @Prop({ required: true })
  login: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  avatarUrl: string;

  @Prop({ required: true })
  accessToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 