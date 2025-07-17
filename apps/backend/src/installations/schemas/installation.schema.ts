import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InstallationDocument = Installation & Document;

@Schema({ timestamps: true })
export class Installation {
  @Prop({ required: true, unique: true })
  installationId: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  accountLogin: string;

  @Prop({ required: true, enum: ['User', 'Organization'] })
  accountType: 'User' | 'Organization';

  @Prop({ type: Object })
  permissions: Record<string, string>;

  @Prop({ required: true, enum: ['all', 'selected'] })
  repositorySelection: 'all' | 'selected';

  @Prop()
  suspendedAt?: Date;

  @Prop()
  suspendedBy?: string;
}

export const InstallationSchema = SchemaFactory.createForClass(Installation); 