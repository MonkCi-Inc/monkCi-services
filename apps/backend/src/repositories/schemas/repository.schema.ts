import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type RepositoryDocument = Repository & Document;

@Schema({ timestamps: true })
export class Repository {
  @Prop({ required: true, unique: true })
  repositoryId: number;

  @Prop({ type: Types.ObjectId, ref: 'Installation' })
  installationId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

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

  // Additional GitHub repository data
  @Prop()
  nodeId: string;

  @Prop()
  htmlUrl: string;

  @Prop()
  url: string;

  @Prop()
  gitUrl: string;

  @Prop()
  sshUrl: string;

  @Prop()
  cloneUrl: string;

  @Prop()
  svnUrl: string;

  @Prop()
  homepage: string;

  @Prop()
  hasIssues: boolean;

  @Prop()
  hasProjects: boolean;

  @Prop()
  hasDownloads: boolean;

  @Prop()
  hasWiki: boolean;

  @Prop()
  hasPages: boolean;

  @Prop()
  hasDiscussions: boolean;

  @Prop()
  mirrorUrl: string;

  @Prop()
  allowForking: boolean;

  @Prop()
  isTemplate: boolean;

  @Prop()
  webCommitSignoffRequired: boolean;

  @Prop()
  visibility: string;

  @Prop()
  license?: MongooseSchema.Types.Mixed;

  @Prop()
  permissions?: MongooseSchema.Types.Mixed;

  @Prop()
  owner?: MongooseSchema.Types.Mixed;
}

export const RepositorySchema = SchemaFactory.createForClass(Repository); 