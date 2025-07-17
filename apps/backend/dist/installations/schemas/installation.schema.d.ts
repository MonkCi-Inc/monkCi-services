import { Document, Types } from 'mongoose';
export type InstallationDocument = Installation & Document;
export declare class Installation {
    installationId: number;
    userId: Types.ObjectId;
    accountLogin: string;
    accountType: 'User' | 'Organization';
    permissions: Record<string, string>;
    repositorySelection: 'all' | 'selected';
    suspendedAt?: Date;
    suspendedBy?: string;
}
export declare const InstallationSchema: import("mongoose").Schema<Installation, import("mongoose").Model<Installation, any, any, any, Document<unknown, any, Installation, any> & Installation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Installation, Document<unknown, {}, import("mongoose").FlatRecord<Installation>, {}> & import("mongoose").FlatRecord<Installation> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
