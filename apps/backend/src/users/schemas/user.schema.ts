import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  githubId: number;

  @Prop({ type: Types.ObjectId, ref: 'EmailAuth', required: false })
  emailAuthId?: Types.ObjectId; // One-to-one mapping to EmailAuth

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

  // Additional GitHub user data
  @Prop()
  nodeId: string;

  @Prop()
  gravatarId: string;

  @Prop()
  url: string;

  @Prop()
  htmlUrl: string;

  @Prop()
  followersUrl: string;

  @Prop()
  followingUrl: string;

  @Prop()
  gistsUrl: string;

  @Prop()
  starredUrl: string;

  @Prop()
  subscriptionsUrl: string;

  @Prop()
  organizationsUrl: string;

  @Prop()
  reposUrl: string;

  @Prop()
  eventsUrl: string;

  @Prop()
  receivedEventsUrl: string;

  @Prop()
  type: string;

  @Prop()
  userViewType: string;

  @Prop()
  siteAdmin: boolean;

  @Prop()
  company: string;

  @Prop()
  blog: string;

  @Prop()
  location: string;

  @Prop()
  hireable: boolean;

  @Prop()
  bio: string;

  @Prop()
  twitterUsername: string;

  @Prop()
  notificationEmail: string;

  @Prop()
  publicRepos: number;

  @Prop()
  publicGists: number;

  @Prop()
  followers: number;

  @Prop()
  following: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); 