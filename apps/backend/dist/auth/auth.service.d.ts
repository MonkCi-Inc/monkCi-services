import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InstallationsService } from '../installations/installations.service';
import { RepositoriesService } from '../repositories/repositories.service';
import { GitHubService } from '../github/github.service';
export declare class AuthService {
    private usersService;
    private installationsService;
    private repositoriesService;
    private githubService;
    private jwtService;
    constructor(usersService: UsersService, installationsService: InstallationsService, repositoriesService: RepositoriesService, githubService: GitHubService, jwtService: JwtService);
    validateGithubCode(code: string): Promise<{
        access_token: string;
        user: {
            id: any;
            githubId: number;
            login: string;
            name: string;
            email: string;
            avatarUrl: string;
        };
        installations: any[];
    }>;
    generateInstallationToken(installationId: number, userId: string): Promise<{
        installation_id: number;
        octokit_authenticated: boolean;
        permissions: Record<string, string>;
    }>;
    syncRepositoriesForInstallation(installation: any): Promise<void>;
    getInstallationOctokit(installationId: number, userId: string): Promise<import("@octokit/core").Octokit & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & import("@octokit/plugin-paginate-graphql").paginateGraphQLInterface & import("@octokit/plugin-rest-endpoint-methods").Api & {
        retry: {
            retryRequest: (error: import("octokit").RequestError, retries: number, retryAfter: number) => import("octokit").RequestError;
        };
    }>;
}
