import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type RepositoryDocument = Repository & Document;
export declare class Repository {
    repositoryId: number;
    installationId?: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    fullName: string;
    private: boolean;
    description?: string;
    defaultBranch: string;
    language?: string;
    topics: string[];
    archived: boolean;
    disabled: boolean;
    fork: boolean;
    size: number;
    stargazersCount: number;
    watchersCount: number;
    forksCount: number;
    openIssuesCount: number;
    createdAt: Date;
    updatedAt: Date;
    pushedAt: Date;
    lastSyncAt: Date;
    nodeId: string;
    htmlUrl: string;
    url: string;
    gitUrl: string;
    sshUrl: string;
    cloneUrl: string;
    svnUrl: string;
    homepage: string;
    hasIssues: boolean;
    hasProjects: boolean;
    hasDownloads: boolean;
    hasWiki: boolean;
    hasPages: boolean;
    hasDiscussions: boolean;
    mirrorUrl: string;
    allowForking: boolean;
    isTemplate: boolean;
    webCommitSignoffRequired: boolean;
    visibility: string;
    license?: MongooseSchema.Types.Mixed;
    permissions?: MongooseSchema.Types.Mixed;
    owner?: MongooseSchema.Types.Mixed;
}
export declare const RepositorySchema: MongooseSchema<Repository, import("mongoose").Model<Repository, any, any, any, Document<unknown, any, Repository, any> & Repository & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Repository, Document<unknown, {}, import("mongoose").FlatRecord<Repository>, {}> & import("mongoose").FlatRecord<Repository> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
