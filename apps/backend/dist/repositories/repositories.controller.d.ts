import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { GitHubService } from '../github/github.service';
import { InstallationsService } from '../installations/installations.service';
export declare class RepositoriesController {
    private readonly repositoriesService;
    private readonly githubService;
    private readonly installationsService;
    constructor(repositoriesService: RepositoriesService, githubService: GitHubService, installationsService: InstallationsService);
    create(createRepositoryDto: CreateRepositoryDto): Promise<import("./schemas/repository.schema").Repository>;
    findAll(installationId?: string): Promise<import("./schemas/repository.schema").Repository[]>;
    findOne(id: string): Promise<import("./schemas/repository.schema").Repository>;
    update(id: string, updateRepositoryDto: Partial<CreateRepositoryDto>): Promise<import("./schemas/repository.schema").Repository>;
    remove(id: string): Promise<import("./schemas/repository.schema").Repository>;
    syncRepositories(installationId: string): Promise<any>;
    getRepositoryCount(): Promise<{
        count: number;
    }>;
    syncAllRepositories(user: any): Promise<any>;
    getRepositoryRunners(id: string): Promise<{
        runners: any[];
        message: string;
        error?: undefined;
    } | {
        runners: any;
        message?: undefined;
        error?: undefined;
    } | {
        runners: any[];
        error: any;
        message?: undefined;
    }>;
    getRepositoryWorkflows(id: string): Promise<{
        workflows: any[];
        message: string;
        error?: undefined;
    } | {
        workflows: any;
        message?: undefined;
        error?: undefined;
    } | {
        workflows: any[];
        error: any;
        message?: undefined;
    }>;
    getWorkflowRuns(id: string, workflowId: string): Promise<{
        runs: any[];
        message: string;
        error?: undefined;
    } | {
        runs: any;
        message?: undefined;
        error?: undefined;
    } | {
        runs: any[];
        error: any;
        message?: undefined;
    }>;
    getWorkflowRunLogs(id: string, runId: string): Promise<{
        logs: any;
        message: string;
        error?: undefined;
    } | {
        logs: any;
        message?: undefined;
        error?: undefined;
    } | {
        logs: any;
        error: any;
        message?: undefined;
    }>;
}
