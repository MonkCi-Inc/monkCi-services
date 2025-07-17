import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RepositoryDocument = Repository & Document;

@Schema({ timestamps: true })
export class Repository {
  @Prop({ required: true, unique: true })
  repositoryId: number;

  @Prop({ type: Types.ObjectId, ref: 'Installation', required: true })
  installationId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  private: boolean;

  @Prop()
  description?: string;

  @Prop({ required: true })
  defaultBranch: string;

  @Prop()
  language?: string;

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ required: true })
  archived: boolean;

  @Prop({ required: true })
  disabled: boolean;

  @Prop({ required: true })
  fork: boolean;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  stargazersCount: number;

  @Prop({ required: true })
  watchersCount: number;

  @Prop({ required: true })
  forksCount: number;

  @Prop({ required: true })
  openIssuesCount: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  pushedAt: Date;

  @Prop({ required: true })
  lastSyncAt: Date;
}

export const RepositorySchema = SchemaFactory.createForClass(Repository); 