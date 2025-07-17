import { Document, Types } from 'mongoose';
export type RepositoryDocument = Repository & Document;
export declare class Repository {
    repositoryId: number;
    installationId: Types.ObjectId;
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
}
export declare const RepositorySchema: import("mongoose").Schema<Repository, import("mongoose").Model<Repository, any, any, any, Document<unknown, any, Repository, any> & Repository & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Repository, Document<unknown, {}, import("mongoose").FlatRecord<Repository>, {}> & import("mongoose").FlatRecord<Repository> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
