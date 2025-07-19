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
        runners: {
            id: number;
            runner_group_id?: number;
            name: string;
            os: string;
            status: string;
            busy: boolean;
            labels: import("@octokit/openapi-types").components["schemas"]["runner-label"][];
            ephemeral?: boolean;
        }[];
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
        workflows: {
            id: number;
            node_id: string;
            name: string;
            path: string;
            state: "active" | "deleted" | "disabled_fork" | "disabled_inactivity" | "disabled_manually";
            created_at: string;
            updated_at: string;
            url: string;
            html_url: string;
            badge_url: string;
            deleted_at?: string;
        }[];
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
        runs: {
            id: number;
            name?: string | null;
            node_id: string;
            check_suite_id?: number;
            check_suite_node_id?: string;
            head_branch: string | null;
            head_sha: string;
            path: string;
            run_number: number;
            run_attempt?: number;
            referenced_workflows?: import("@octokit/openapi-types").components["schemas"]["referenced-workflow"][] | null;
            event: string;
            status: string | null;
            conclusion: string | null;
            workflow_id: number;
            url: string;
            html_url: string;
            pull_requests: import("@octokit/openapi-types").components["schemas"]["pull-request-minimal"][] | null;
            created_at: string;
            updated_at: string;
            actor?: import("@octokit/openapi-types").components["schemas"]["simple-user"];
            triggering_actor?: import("@octokit/openapi-types").components["schemas"]["simple-user"];
            run_started_at?: string;
            jobs_url: string;
            logs_url: string;
            check_suite_url: string;
            artifacts_url: string;
            cancel_url: string;
            rerun_url: string;
            previous_attempt_url?: string | null;
            workflow_url: string;
            head_commit: import("@octokit/openapi-types").components["schemas"]["nullable-simple-commit"];
            repository: import("@octokit/openapi-types").components["schemas"]["minimal-repository"];
            head_repository: import("@octokit/openapi-types").components["schemas"]["minimal-repository"];
            head_repository_id?: number;
            display_title: string;
        }[];
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
        logs: unknown;
        message?: undefined;
        error?: undefined;
    } | {
        logs: any;
        error: any;
        message?: undefined;
    }>;
}
