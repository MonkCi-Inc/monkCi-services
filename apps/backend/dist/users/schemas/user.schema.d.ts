import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    githubId: number;
    login: string;
    name: string;
    email: string;
    avatarUrl: string;
    accessToken: string;
    nodeId: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    followersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    userViewType: string;
    siteAdmin: boolean;
    company: string;
    blog: string;
    location: string;
    hireable: boolean;
    bio: string;
    twitterUsername: string;
    notificationEmail: string;
    publicRepos: number;
    publicGists: number;
    followers: number;
    following: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
