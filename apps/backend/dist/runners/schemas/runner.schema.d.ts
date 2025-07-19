import { Document, Types } from 'mongoose';
export type RunnerDocument = Runner & Document;
export declare enum RunnerStatus {
    IDLE = "idle",
    BUSY = "busy",
    OFFLINE = "offline",
    ERROR = "error"
}
export declare enum RunnerArchitecture {
    X86_64 = "x86_64",
    ARM64 = "arm64",
    ARM32 = "arm32"
}
export declare enum RunnerOperatingSystem {
    LINUX = "linux",
    WINDOWS = "windows",
    MACOS = "macos"
}
export declare class Runner {
    runnerId: string;
    userId: Types.ObjectId;
    installations: Types.ObjectId[];
    name: string;
    description?: string;
    status: RunnerStatus;
    architecture: RunnerArchitecture;
    operatingSystem: RunnerOperatingSystem;
    labels: string[];
    capabilities: Record<string, any>;
    environment: Record<string, string>;
    version?: string;
    lastSeenAt?: Date;
    lastHeartbeatAt?: Date;
    systemInfo: {
        cpuCount?: number;
        memoryGB?: number;
        diskSpaceGB?: number;
        hostname?: string;
        ipAddress?: string;
    };
    currentJob?: {
        jobId: string;
        repository: string;
        workflow: string;
        startedAt: Date;
    };
    jobHistory: Array<{
        jobId: string;
        repository: string;
        workflow: string;
        status: string;
        startedAt: Date;
        completedAt?: Date;
        duration?: number;
    }>;
    totalJobsCompleted: number;
    totalJobsFailed: number;
    totalRuntimeSeconds: number;
    registrationToken?: string;
    accessToken?: string;
    isActive: boolean;
}
export declare const RunnerSchema: import("mongoose").Schema<Runner, import("mongoose").Model<Runner, any, any, any, Document<unknown, any, Runner, any> & Runner & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Runner, Document<unknown, {}, import("mongoose").FlatRecord<Runner>, {}> & import("mongoose").FlatRecord<Runner> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
