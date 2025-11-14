import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmailAuthDocument = EmailAuth & Document;

@Schema({ timestamps: true })
export class EmailAuth {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string; // Hashed with bcrypt

  @Prop()
  name?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId; // One-to-one mapping to User (GitHub account)

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const EmailAuthSchema = SchemaFactory.createForClass(EmailAuth);

