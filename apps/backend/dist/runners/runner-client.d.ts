#!/usr/bin/env node
interface RunnerConfig {
    apiUrl: string;
    registrationToken: string;
    name: string;
    description?: string;
    labels?: string[];
}
declare class MonkCIRunner {
    private config;
    private runnerId;
    private accessToken;
    private isRunning;
    private currentJob;
    constructor(config: RunnerConfig);
    register(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    private startHeartbeat;
    private startJobPolling;
    private requestJob;
    private executeJob;
    private executeStep;
    private completeJob;
    private getSystemInfo;
    private getLocalIP;
    private getCapabilities;
    private getNpmVersion;
    private getGitVersion;
    private getDockerVersion;
}
export { MonkCIRunner };
