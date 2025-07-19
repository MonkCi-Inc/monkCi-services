import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RunnerDocument = Runner & Document;

export enum RunnerStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline',
  ERROR = 'error'
}

export enum RunnerArchitecture {
  X86_64 = 'x86_64',
  ARM64 = 'arm64',
  ARM32 = 'arm32'
}

export enum RunnerOperatingSystem {
  LINUX = 'linux',
  WINDOWS = 'windows',
  MACOS = 'macos'
}

@Schema({ timestamps: true })
export class Runner {
  @Prop({ required: true, unique: true })
  runnerId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Installation', default: [] })
  installations: Types.ObjectId[];

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: RunnerStatus, default: RunnerStatus.OFFLINE })
  status: RunnerStatus;

  @Prop({ required: true, enum: RunnerArchitecture })
  architecture: RunnerArchitecture;

  @Prop({ required: true, enum: RunnerOperatingSystem })
  operatingSystem: RunnerOperatingSystem;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: Object, default: {} })
  capabilities: Record<string, any>;

  @Prop({ type: Object, default: {} })
  environment: Record<string, string>;

  @Prop()
  version?: string;

  @Prop()
  lastSeenAt?: Date;

  @Prop()
  lastHeartbeatAt?: Date;

  @Prop({ type: Object, default: {} })
  systemInfo: {
    cpuCount?: number;
    memoryGB?: number;
    diskSpaceGB?: number;
    hostname?: string;
    ipAddress?: string;
  };

  @Prop({ type: Object, default: {} })
  currentJob?: {
    jobId: string;
    repository: string;
    workflow: string;
    startedAt: Date;
  };

  @Prop({ type: [Object], default: [] })
  jobHistory: Array<{
    jobId: string;
    repository: string;
    workflow: string;
    status: string;
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
  }>;

  @Prop({ default: 0 })
  totalJobsCompleted: number;

  @Prop({ default: 0 })
  totalJobsFailed: number;

  @Prop({ default: 0 })
  totalRuntimeSeconds: number;

  @Prop()
  registrationToken?: string;

  @Prop()
  accessToken?: string;

  @Prop({ default: false })
  isActive: boolean;
}

export const RunnerSchema = SchemaFactory.createForClass(Runner); 