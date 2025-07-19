import { RunnerArchitecture, RunnerOperatingSystem } from '../schemas/runner.schema';
export declare class CreateRunnerDto {
    name: string;
    description?: string;
    architecture: RunnerArchitecture;
    operatingSystem: RunnerOperatingSystem;
    labels?: string[];
    capabilities?: Record<string, any>;
    environment?: Record<string, string>;
    version?: string;
    systemInfo?: {
        cpuCount?: number;
        memoryGB?: number;
        diskSpaceGB?: number;
        hostname?: string;
        ipAddress?: string;
    };
}
export declare class RegisterRunnerDto {
    registrationToken: string;
    name: string;
    description?: string;
    architecture: RunnerArchitecture;
    operatingSystem: RunnerOperatingSystem;
    labels?: string[];
    capabilities?: Record<string, any>;
    environment?: Record<string, string>;
    version?: string;
    systemInfo?: {
        cpuCount?: number;
        memoryGB?: number;
        diskSpaceGB?: number;
        hostname?: string;
        ipAddress?: string;
    };
}
export declare class UpdateRunnerDto {
    name?: string;
    description?: string;
    labels?: string[];
    capabilities?: Record<string, any>;
    environment?: Record<string, string>;
    isActive?: boolean;
}
